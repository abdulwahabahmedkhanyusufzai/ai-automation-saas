package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/hibiken/asynq"
)

// Define the redis connection
const redisAddr = "127.0.0.1:6379"
const agentURL = "http://127.0.0.1:8000/api/v1/agent/run"

// 1. Define the structure of our payload
type WorkflowPayload struct {
	WorkflowID  string `json:"workflow_id"`
	Instruction string `json:"instruction"`
}

// 2. The Worker Function that processes the Redis queue
func HandleWorkflowTask(ctx context.Context, t *asynq.Task) error {
	var payload WorkflowPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return fmt.Errorf("json unmarshal failed: %v", err)
	}

	log.Printf("[Worker] Pulled task from Redis: %s", payload.WorkflowID)

	// Forward the payload to the Python Agent Engine via HTTP POST
	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(agentURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to call python engine: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("python engine failed with status: %d", resp.StatusCode)
	}

	log.Printf("[Worker] Successfully processed task: %s", payload.WorkflowID)
	return nil
}

func main() {
	// 3. Start the Asynq Background Worker in a Goroutine
	go func() {
		srv := asynq.NewServer(
			asynq.RedisClientOpt{Addr: redisAddr},
			asynq.Config{
				Concurrency: 10, // Can process 10 workflows at the exact same time
			},
		)

		// Map the event string to our worker function
		mux := asynq.NewServeMux()
		mux.HandleFunc("agent:run_workflow", HandleWorkflowTask)

		log.Println("[Worker] Listening to Redis queue...")
		if err := srv.Run(mux); err != nil {
			log.Fatalf("could not run worker server: %v", err)
		}
	}()

	// 4. Initialize the API (Fiber)
	app := fiber.New()
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})
	defer client.Close()

	app.Post("/api/v1/workflows/trigger", func(c *fiber.Ctx) error {
		taskPayload := []byte(`{"workflow_id": "run_001", "instruction": "analyze_data"}`)
		task := asynq.NewTask("agent:run_workflow", taskPayload)

		info, err := client.Enqueue(task)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to queue workflow"})
		}

		return c.JSON(fiber.Map{
			"message": "Workflow queued successfully",
			"task_id": info.ID,
		})
	})

	log.Println("[API] Starting Orchestrator on port 8080...")
	log.Fatal(app.Listen(":8080"))
}
