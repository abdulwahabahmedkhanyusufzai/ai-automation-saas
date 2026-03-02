package main

import (
	"ai-saas-orchesrator/internal/db"
	"ai-saas-orchesrator/internal/handlers"
	"ai-saas-orchesrator/internal/middleware"
	"ai-saas-orchesrator/internal/models"
	"ai-saas-orchesrator/internal/worker"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/hibiken/asynq"
	"github.com/joho/godotenv"
)

func init() {
	// Load the .env file
	if err := godotenv.Load(); err != nil {
		// Try loading from project root if running from cmd/orchestrator
		if err := godotenv.Load("../../.env"); err != nil {
			log.Println("No .env file found; using environment variables from system")
		}
	}

	// Initialize global variables in model from env
	models.InitConfig()
}

func main() {
	// 1. Initialize DB
	db.InitDB()
	defer db.DB.Close()

	// 2. Start Asynq Worker in Goroutine
	go func() {
		srv := asynq.NewServer(
			asynq.RedisClientOpt{Addr: models.RedisAddr},
			asynq.Config{Concurrency: 10},
		)
		mux := asynq.NewServeMux()
		mux.HandleFunc("agent:run_workflow", worker.HandleWorkflowTask)

		log.Println("[Worker] Listening to Redis queue...")
		if err := srv.Run(mux); err != nil {
			log.Fatalf("could not run worker server: %v", err)
		}
	}()

	// 3. Initialize Fiber App
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Setup Redis Client for API
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: models.RedisAddr})
	defer client.Close()

	// 4. Routes
	app.Post("/signup", handlers.Signup)
	app.Post("/login", handlers.Login)
	app.Post("/google-login", handlers.GoogleLogin)

	api := app.Group("/api/v1")
	api.Use(middleware.JWTMiddleware)
	api.Post("/workflows/trigger", handlers.TriggerWorkflow(client))
	api.Get("/workflows/status/:id", handlers.GetWorkflowStatus)

	// Internal progress signal receiver from Python
	api.Post("/internal/progress", handlers.UpdateProgress)

	// Get port from env
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("[API] Starting Orchestrator on port %s...", port)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
