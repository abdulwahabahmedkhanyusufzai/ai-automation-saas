from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import TypedDict
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

# Configuration
api_key = os.getenv("GOOGLE_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview", # SaaS-grade speed and reliability
    google_api_key=api_key,
    temperature=0.3,
    max_retries=3
)

# Signal Helper to notify Go API of progress with real-time content
async def send_signal(task_id: str, phase: str, message: str = ""):
    if not task_id: return
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/api/v1/internal/progress",
                json={
                    "task_id": task_id, 
                    "phase": phase,
                    "message": message
                },
                timeout=2.0
            )
    except Exception as e:
        print(f"[Signal Error] {e}")

# --- SaaS-Grade Agentic State Definitions ---
class AgentState(TypedDict):
    task_id: str
    instruction: str
    plan: str
    deep_analysis: str
    result: str

# --- Node 1: Strategic Planner ---
async def planner_node(state: AgentState):
    print("[Agent] Strategic Planning Phase...")
    await send_signal(state.get('task_id'), "planning", "Initializing Plan...")
    
    prompt = f"""
    Analyze the following request and create a high-level 3-point strategy for resolution.
    Request: {state['instruction']}
    Provide only the plan steps.
    """
    response = await llm.ainvoke(prompt)
    
    # Send what Gemini provided for this step
    await send_signal(state.get('task_id'), "planning", response.content)
    
    return {"plan": response.content}

# --- Node 2: Deep Analysis Researcher ---
async def researcher_node(state: AgentState):
    print("[Agent] Deep Analysis Phase...")
    await send_signal(state.get('task_id'), "researching", "Performing Deep Research...")
    
    prompt = f"""
    Using the strategic plan:
    {state['plan']}
    
    Solve the original request: {state['instruction']}
    Provide a detailed, expert-level analysis or solution.
    """
    response = await llm.ainvoke(prompt)
    
    # Send researcher output
    await send_signal(state.get('task_id'), "researching", response.content)
    
    return {"deep_analysis": response.content}

# --- Node 3: UI/UX Content Stylist ---
async def stylist_node(state: AgentState):
    print("[Agent] Synthesis & Formatting Phase...")
    await send_signal(state.get('task_id'), "styling", "Applying SaaS Styling...")
    
    prompt = f"""
    Format the following analysis into a premium, SaaS-quality report.
    Use professional Markdown, including:
    - Bold Headers
    - Bullet points for readability
    - A 'Key Insights' summary section
    - A short 'Next Steps' recommendation
    
    Content to format:
    {state['deep_analysis']}
    """
    response = await llm.ainvoke(prompt)
    
    # Send styling output
    await send_signal(state.get('task_id'), "styling", response.content)
    
    return {"result": response.content}

# --- Build the High-Performance SaaS Workflow Graph ---
workflow = StateGraph(AgentState)

# Define our professional agent nodes
workflow.add_node("planner", planner_node)
workflow.add_node("researcher", researcher_node)
workflow.add_node("stylist", stylist_node)

# Map the logical flow (START -> Plan -> Research -> Style -> END)
workflow.add_edge(START, "planner")
workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "stylist")
workflow.add_edge("stylist", END)

# Compile into an executable SaaS Engine
app_graph = workflow.compile()

# Primary Export for Orchestrator
async def run_workflow(instruction: str, task_id: str = "") -> dict:
    initial_state = {
        "task_id": task_id,
        "instruction": instruction, 
        "plan": "", 
        "deep_analysis": "", 
        "result": ""
    }
    # Execute the multi-step reasoning chain
    final_state = await app_graph.ainvoke(initial_state)
    return final_state