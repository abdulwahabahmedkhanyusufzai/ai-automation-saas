from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from agent import run_workflow

# Initialize the FastAPI app
app = FastAPI(title="AI Agent Engine", description="Executes LangGraph Workflows")

# Define the strict typing for incoming requests
class WorkflowPayload(BaseModel):
    workflow_id: str
    instruction: str

# The core execution endpoint
@app.post("/api/v1/agent/run")
async def run_agent(payload: WorkflowPayload):
    print(f"\n[Agent Engine] Picked up workflow: {payload.workflow_id}")
    print(f"[Agent Engine] Instruction: {payload.instruction}")
    
    # TODO: This is where we will integrate LangGraph and OpenAI/LLM calls.
    graph_result = run_workflow(payload.instruction)

    print(f"[Agent Engine] Graph execution complete.") 
    
    # Return the processed result
    return {
        "status": "success",
        "workflow_id": payload.workflow_id,
        "final_result": graph_result["result"]
    }

# Health check route
@app.get("/health")
async def health_check():
    return {"status": "Agent Engine is alive and ready."}

if __name__ == "__main__":
    # Run the server on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)