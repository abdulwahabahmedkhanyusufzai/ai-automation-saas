# Python AI Agent Engine 🐍

High-performance AI agent workflow execution using LangGraph and Gemini.

## Features
- **LangGraph Strategy**: Planning $\to$ Researching $\to$ Styling.
- **Bi-directional Signaling**: Sends real-time progress updates back to the Go orchestrator.
- **FastAPI Core**: Lightweight and high-performance.

## Project Structure
```text
├── src/                # Python source code
│   ├── main.py         # FastAPI API Entrypoint
│   └── agent.py        # LangGraph definitions
├── .env                # Gemini API Key (GOOGLE_API_KEY)
└── requirements.txt    # Python dependencies
```

## Setup & Running
1. `pip install -r requirements.txt`
2. `python src/main.py`
