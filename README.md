# AgenticSaaS 🚀
### Enterprise-Grade [Distributed AI Orchestration](https://github.com)

AgenticSaaS is a polyglot microservices platform designed for high-performance AI agent workflows. It leverages **Go** for high-concurrency orchestration, **Python** for sophisticated AI reasoning (LangGraph), and **Redis** for asynchronous task distribution.

---

## 🏗️ Architecture Overview

The system is built on a distributed microservices model to ensure scalability and fault tolerance.

```mermaid
graph TD
    User((User)) -->|Next.js| Frontend[Frontend React/Next.js]
    Frontend -->|JWT Auth| GoOrch[Go Orchestrator API]
    GoOrch -->|Postgres| DB[(Database)]
    GoOrch -->|Enqueue| Redis[(Redis Queue)]
    
    subgraph "Worker Layer"
        Asynq[Asynq Workers]
        Redis --> Asynq
        Asynq -->|HTTP API| AgentEngine[Python Agent Engine]
    end

    subgraph "AI Reasoning"
        AgentEngine -->|LangGraph| LLM[Gemini 1.5 Flash / 3 Preview]
        LLM -->|Signals| GoOrch
    end
    
    GoOrch -.->|Live Progress| Frontend
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js (TS), Tailwind CSS, Lucide | Premium UI/UX & Real-time polling |
| **Orchestration** | Go (Fiber), Gorm | High-speed API & JWT Security |
| **Task Queue** | Redis, Asynq | Asynchronous background processing |
| **AI Agent** | Python, LangGraph, LangChain | Multi-step reasoning & state management |
| **Model** | Google Gemini | Large Language Model (Flash/Pro) |
| **Auth** | Google OAuth, JWT | Secure identity management |

---

## ⚡ Key Features

1. **Multi-Phase Reasoning**: Agents follow a strategic **Planning $\to$ Researching $\to$ Styling** flow.
2. **Real-Time Signaling**: Watch agents think in real-time with live content streaming to the dashboard.
3. **Fault-Tolerant**: Independent microservices with retries and task persistence.
4. **SaaS Graphics**: Premium, responsive dashboard with glassmorphism and animated workflow tracking.

---

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker-Compose
- Go 1.25+
- Python 3.10+
- Google Cloud API Key (Gemini)
- Google OAuth Client ID

### 2. Environment Setup
Create a `.env` in the `orchestrator/` and `agent-engine/` directories:

**Orchestrator (.env):**
```env
DB_HOST=localhost
DB_PORT=5433
REDIS_ADDR=127.0.0.1:6379
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
```

**Agent Engine (.env):**
```env
GOOGLE_API_KEY=your_key
```

### 3. Run the Stack
```bash
# Start Infra (Redis/Postgres)
docker-compose up -d

# Run Orchestrator
cd orchestrator
go run cmd/orchestrator/main.go

# Run Agent
cd agent-engine
python main.py

# Run Frontend
cd frontend
npm run dev
```

---

## 📡 Live Signaling Flow
AgenticSaaS uses a bi-directional signaling pattern. While the `Asynq` worker handles the heavy lifting, the **Python Agent** sends HTTP "heartbeats" back to the **Go API** at every phase of its reasoning cycle. This allows the frontend to show **live "thinking" progress** even during long-running tasks.

---

## 📂 Project Structure
```text
├── agent-engine/        # Python LangGraph engine
├── orchestrator/        # Go (Fiber) & Asynq Workers
├── frontend/            # Next.js 15+ Dashboard
└── docker-compose.yaml  # Shared infrastructure
```
