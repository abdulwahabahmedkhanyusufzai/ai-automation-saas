import uvicorn
import asyncio
import sys
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware # Import this!
from pydantic import BaseModel
from agent import run_workflow
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[System] AI Agent Engine initialized and warming up...")
    yield
    print("[System] Shutting down AI Agent Engine...")

app = FastAPI(
    title="AI Agent Engine", 
    description="High-Performance LangGraph Execution",
    lifespan=lifespan
)

# --- Optimization: GZip Compression ---
app.add_middleware(GZipMiddleware, minimum_size=1000)

class WorkflowPayload(BaseModel):
    workflow_id: str
    instruction: str

@app.post("/api/v1/agent/run")
async def run_agent(payload: WorkflowPayload):
    print(f"\n[Agent Engine] Picked up workflow: {payload.workflow_id}")
    
    # Executes our optimized LangGraph
    graph_result = await run_workflow(payload.instruction, task_id=payload.workflow_id)

    print(f"[Agent Engine] Graph execution complete.") 
    
    return {
        "status": "success",
        "workflow_id": payload.workflow_id,
        "final_result": graph_result["result"]
    }

@app.get("/health")
async def health_check():
    return {"status": "Agent Engine is alive and ready."}

if __name__ == "__main__":
    # --- Windows Performance Optimization ---
    if sys.platform == 'win32':
        # ProactorEventLoop is the high-performance loop for Windows
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # --- Production-Ready Runner ---
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        # On Windows, 'workers' must be 1 if using a custom loop policy in __main__
        workers=1,           
        http="httptools",    # Faster HTTP parser (works on Windows)
        log_level="info"
    )
