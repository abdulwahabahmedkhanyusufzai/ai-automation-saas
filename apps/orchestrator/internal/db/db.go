package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	// Build the connection string from environment variables
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("❌ Invalid connection string format:", err)
	}

	// Set connection pool limits (Critical for SaaS stability)
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// RETRY LOGIC: Databases in containers often take a few seconds to boot.
	// We will attempt to connect 10 times before giving up.
	log.Println("🔄 Connecting to PostgreSQL at:", os.Getenv("DB_HOST"))
	
	for i := 1; i <= 10; i++ {
		// Create a timeout context for the Ping (preventing the hang)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		
		err = DB.PingContext(ctx)
		cancel() // Free resources immediately after ping

		if err == nil {
			log.Println("✅ Successfully connected to PostgreSQL!")
			break
		}

		log.Printf("⚠️  Database not reachable (attempt %d/10): %v", i, err)
		if i == 10 {
			log.Fatal("❌ Failed to connect to DB after 10 attempts. Exiting.")
		}
		time.Sleep(2 * time.Second)
	}

	// Create Users table
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	log.Println("🚀 Ensuring tables exist...")
	if _, err = DB.Exec(createTableQuery); err != nil {
		log.Fatal("❌ Failed to create/verify users table:", err)
	}
	
	log.Println("✨ Database initialization complete!")
}