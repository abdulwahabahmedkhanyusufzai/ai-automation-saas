package models

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
)

// Exported Symbols (assigned from env in main)
var (
	JWTKey             []byte
	RedisAddr          string
	AgentURL           string
	GoogleClientID     string
	GithubClientID     string
	GithubClientSecret string
)

// InitConfig loads exported symbols from environment variables
func InitConfig() {
	JWTKey = []byte(os.Getenv("JWT_SECRET"))
	RedisAddr = os.Getenv("REDIS_ADDR")
	AgentURL = os.Getenv("AGENT_URL")
	GoogleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	GithubClientID = os.Getenv("GITHUB_CLIENT_ID")
	GithubClientSecret = os.Getenv("GITHUB_CLIENT_SECRET")
}

// Structs
type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type WorkflowPayload struct {
	WorkflowID  string `json:"workflow_id"`
	Instruction string `json:"instruction"`
}
