from langgraph.graph import StateGraph, START, END
from typing import TypedDict
import os

# Define the State. This is the "memory" that gets passed between nodes.
class AgentState(TypedDict):
    instruction: str
    result: str

# Node 1: The Reasoning Engine
def reasoning_node(state: AgentState):
    instruction = state["instruction"]
    
    # NOTE: To connect a real LLM, you would do this:
    # from langchain_openai import ChatOpenAI
    # llm = ChatOpenAI(model="gpt-4o")
    # response = llm.invoke(instruction)
    # result_text = response.content
    
    # For local testing without an API key, we will simulate the LLM's output:
    print(f"      -> [LangGraph Node] Processing instruction: {instruction}")
    result_text = f"Successfully analyzed and processed: '{instruction}'"
    
    return {"result": result_text}

# Build the Graph
workflow = StateGraph(AgentState)

# Add the nodes (steps) to our graph
workflow.add_node("reason", reasoning_node)

# Define the edges (the flow of execution)
workflow.add_edge(START, "reason")
workflow.add_edge("reason", END)

# Compile the graph into an executable application
app_graph = workflow.compile()

# Export a function to be called by our API
def run_workflow(instruction: str) -> dict:
    initial_state = {"instruction": instruction, "result": ""}
    final_state = app_graph.invoke(initial_state)
    return final_state