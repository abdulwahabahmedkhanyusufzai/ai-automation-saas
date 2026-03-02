package worker

import (
	"ai-saas-orchesrator/internal/models"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/hibiken/asynq"
)

// Asynq Worker Function (Handles Redis Queue)
func HandleWorkflowTask(ctx context.Context, t *asynq.Task) error {
	var payload models.WorkflowPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return fmt.Errorf("json unmarshal failed: %v", err)
	}

	log.Printf("[Worker] Pulled task from Redis: %s", payload.WorkflowID)
	startTime := time.Now()

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(models.AgentURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to call python engine: %v", err)
	}
	defer resp.Body.Close()

	log.Printf("[Worker] Agent Engine response received in %v", time.Since(startTime))

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %v", err)
	}
	if _, err := t.ResultWriter().Write(body); err != nil {
		return fmt.Errorf("failed to write result: %v", err)
	}
	if resp.StatusCode != 200 {
		return fmt.Errorf("python engine failed with status: %d", resp.StatusCode)
	}

	log.Printf("[Worker] Successfully processed task: %s", payload.WorkflowID)
	return nil
}
