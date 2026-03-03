# System Architecture 🏛️

## Overview
AgenticSaaS is a distributed microservices platform designed for high-performance AI agent workflows.

### 🧩 Core Components
1. **Frontend (Next.js)**: Modern glassmorphism UI for real-time interaction.
2. **Orchestrator (Go/Fiber)**: High-speed API and background worker dispatcher.
3. **Agent Engine (Python/FastAPI)**: Sophisticated AI reasoning engine (LangGraph).
4. **Data Layer**:
   - **PostgreSQL**: Relational storage for users and tasks.
   - **Redis**: Asynchronous task distribution and live progress state.

## 📡 Distributed Task Lifecycle
1. User trigers an AI task on the **Frontend**.
2. **Orchestrator** creates a record in Postgres and enqueues a task in **Redis (Asynq)**.
3. **Asynq Worker** picks up the task and executes a POST request to the **Agent Engine (Python)**.
4. **Agent Engine** executes the LangGraph workflow:
   - **Step 1 (Planner)**: Generates a 3-point strategy.
   - **Step 2 (Researcher)**: Performs deep analysis.
   - **Step 3 (Stylist)**: Formats content into a premium report.
5. Throughout the workflow, the **Agent Engine** sends HTTP "Heartbeat Signals" back to the **Orchestrator**.
6. **Orchestrator** updates the Redis state and broadcasts progress to the **Frontend** via polling.

## 🔐 Security
- **Auth**: Google & GitHub OAuth.
- **JWT**: Bearer tokens are issued by the Go backend.
- **Microservice Auth**: Internal services communicate via restricted VPC or shared secret-based verification (TBD).
