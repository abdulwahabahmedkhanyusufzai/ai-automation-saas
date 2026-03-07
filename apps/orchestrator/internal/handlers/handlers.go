package handlers

import (
	"ai-saas-orchesrator/internal/db"
	"ai-saas-orchesrator/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hibiken/asynq"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
)

// --- FIBER AUTH HANDLERS ---

func Signup(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Server error"})
	}

	insertQuery := `INSERT INTO users (email, password) VALUES ($1, $2)`
	_, err = db.DB.Exec(insertQuery, user.Email, string(hashedPassword))
	if err != nil {
		return c.Status(409).JSON(fiber.Map{"error": "Email already exists"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "User created successfully"})
}

func Login(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	var storedHash string
	var id int
	err := db.DB.QueryRow("SELECT id, password FROM users WHERE email=$1", user.Email).Scan(&id, &storedHash)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(user.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Email: user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(models.JWTKey)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error generating token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":   tokenString,
	})
}

func GoogleLogin(c *fiber.Ctx) error {
	var body struct {
		Token string `json:"token"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	payload, err := idtoken.Validate(context.Background(), body.Token, models.GoogleClientID)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid Google token"})
	}

	email := payload.Claims["email"].(string)

	// Check if user exists, otherwise create
	var id int
	err = db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&id)
	if err != nil {
		// Create a user with a long random password that they can't guess (Google doesn't use it)
		insertQuery := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`
		err = db.DB.QueryRow(insertQuery, email, "google-authenticated-user-no-password").Scan(&id)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Database error"})
		}
	}

	// Generate JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(models.JWTKey)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error generating token"})
	}

	return c.JSON(fiber.Map{
		"message": "Google Login successful",
		"token":   tokenString,
	})
}

func GithubLogin(c *fiber.Ctx) error {
	var body struct {
		Code string `json:"code"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// 1. Exchange code for access token
	clientID := strings.TrimSpace(models.GithubClientID)
	clientSecret := strings.TrimSpace(models.GithubClientSecret)
	if clientID == "" || clientSecret == "" {
		log.Printf("github token exchange error: missing GitHub credentials (GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET)")
		return c.Status(500).JSON(fiber.Map{"error": "GitHub OAuth is not configured (missing GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET)"})
	}

	code := strings.TrimSpace(body.Code)
	if code == "" {
		log.Printf("github token exchange error: missing code from frontend")
		return c.Status(400).JSON(fiber.Map{"error": "Missing GitHub OAuth code"})
	}

	log.Printf("github token exchange request: code=%q", code)

	tokenURL := "https://github.com/login/oauth/access_token"
	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("code", code)

	req, _ := http.NewRequest("POST", tokenURL, strings.NewReader(data.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to authenticate with GitHub"})
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var tokenResp struct {
		AccessToken      string `json:"access_token"`
		TokenType        string `json:"token_type"`
		Scope            string `json:"scope"`
		Error            string `json:"error"`
		ErrorDescription string `json:"error_description"`
	}
	if err := json.Unmarshal(bodyBytes, &tokenResp); err != nil {
		log.Printf("github token exchange: failed to parse response: %v; raw=%s", err, string(bodyBytes))
	} else if tokenResp.Error != "" {
		log.Printf("github token exchange error: %s - %s", tokenResp.Error, tokenResp.ErrorDescription)
	}

	if tokenResp.AccessToken == "" {
		log.Printf("github token exchange failed (status=%d): %s", resp.StatusCode, string(bodyBytes))
		message := "Invalid code from GitHub"
		if tokenResp.Error != "" {
			message = fmt.Sprintf("GitHub token error: %s", tokenResp.ErrorDescription)
		}
		return c.Status(401).JSON(fiber.Map{"error": message})
	}

	// 2. Fetch user information
	userReq, _ := http.NewRequest("GET", "https://api.github.com/user", nil)
	userReq.Header.Set("Authorization", "token "+tokenResp.AccessToken)
	userResp, err := client.Do(userReq)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch GitHub user"})
	}
	defer userResp.Body.Close()

	var githubUser struct {
		Email string `json:"email"`
		Login string `json:"login"`
	}
	json.NewDecoder(userResp.Body).Decode(&githubUser)

	email := githubUser.Email
	// If email is private, we need to fetch user emails specifically
	if email == "" {
		emailsReq, _ := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
		emailsReq.Header.Set("Authorization", "token "+tokenResp.AccessToken)
		emailsResp, err := client.Do(emailsReq)
		if err == nil {
			defer emailsResp.Body.Close()
			var githubEmails []struct {
				Email   string `json:"email"`
				Primary bool   `json:"primary"`
			}
			json.NewDecoder(emailsResp.Body).Decode(&githubEmails)
			for _, e := range githubEmails {
				if e.Primary {
					email = e.Email
					break
				}
			}
		}
	}

	if email == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Github primary email not found"})
	}

	// 3. User Sync (Database)
	var id int
	err = db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&id)
	if err != nil {
		insertQuery := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`
		err = db.DB.QueryRow(insertQuery, email, "github-auth-no-password").Scan(&id)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Database error"})
		}
	}

	// 4. Local JWT Issue
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(models.JWTKey)

	return c.JSON(fiber.Map{
		"message": "GitHub Login successful",
		"token":   tokenString,
	})
}

func TriggerWorkflow(client *asynq.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		payload := new(models.WorkflowPayload)
		if err := c.BodyParser(payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
		}

		// Enqueue with a placeholder ID if needed, or get the ID after enqueue
		// For asynq, we can't easily put the ID inside the payload before we have the ID.
		// So we override the WorkflowID in the payload with the Asynq Task ID.
		taskPayload, _ := json.Marshal(payload)
		task := asynq.NewTask("agent:run_workflow", taskPayload, asynq.Retention(1*time.Hour))
		info, err := client.Enqueue(task)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to queue workflow"})
		}
		return c.JSON(fiber.Map{"message": "Workflow queued", "task_id": info.ID})
	}
}

func UpdateProgress(c *fiber.Ctx) error {
	var payload struct {
		TaskID  string `json:"task_id"`
		Phase   string `json:"phase"`
		Message string `json:"message"`
	}
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid progress update"})
	}

	log.Printf("[Internal] Task %s entered phase %s with content length %d", payload.TaskID, payload.Phase, len(payload.Message))

	SetProgress(payload.TaskID, payload.Phase, payload.Message)

	return c.SendStatus(200)
}

type TaskProgress struct {
	Phase   string
	Message string
}

var progressMap = make(map[string]TaskProgress)

func SetProgress(id, phase, message string) {
	progressMap[id] = TaskProgress{Phase: phase, Message: message}
}

func GetProgress(id string) TaskProgress {
	return progressMap[id]
}

func GetWorkflowStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	inspector := asynq.NewInspector(asynq.RedisClientOpt{Addr: models.RedisAddr})

	info, err := inspector.GetTaskInfo("default", id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}

	progress := GetProgress(id)
	if info.Result == nil {
		return c.JSON(fiber.Map{
			"status": "processing",
			"phase":  progress.Phase,
			"live":   progress.Message,
		})
	}

	var result map[string]interface{}
	if err := json.Unmarshal(info.Result, &result); err != nil {
		log.Printf("[WorkflowStatus] failed to unmarshal result for task %s: %v; raw=%s", id, err, string(info.Result))
		// If we can't parse JSON, return raw response as a fallback to avoid client crashes.
		result = map[string]interface{}{"final_result": string(info.Result)}
	}

	if result == nil {
		result = map[string]interface{}{"final_result": string(info.Result)}
	}

	return c.JSON(fiber.Map{
		"status": "completed",
		"data":   result,
		"phase":  "completed",
	})
}

