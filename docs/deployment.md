# Deployment Guide 🚀

This document outlines how to deploy the **AgenticSaaS** stack from the terminal using Docker.

## 📋 Prerequisites
- **Docker & Docker Compose** installed.
- **Environment variables** configured (see `.env.example` in `configs/`).

## 🛠️ Step 1: Configure Environment Variables
Before deploying, ensure each service has its `.env` file populated.
1. Copy `configs/.env.example` to each service:
   - `apps/frontend/.env.local`
   - `apps/orchestrator/.env`
   - `apps/agent-engine/.env`
2. Fill in the required API keys (Google, GitHub, Gemini).

## 🏗️ Step 2: Build the Production Images
Run the following command from the project root:
```bash
make build-prod
```
This will compile the Go binary, build the Next.js standalone package, and prepare the Python environment in their respective Docker containers.

## 🚀 Step 3: Deploy the Stack
Start all services in detached mode:
```bash
make deploy-prod
```
The stack includes:
- **PostgreSQL** (Port 5433)
- **Redis** (Port 6379)
- **Go Orchestrator** (Port 8080)
- **Python Agent Engine** (Port 8000)
- **Next.js Frontend** (Port 3000)

## 📊 Step 4: Verify Deployment
Check the status of the containers:
```bash
docker ps
```
Or view logs:
```bash
docker-compose -f deployments/docker/docker-compose.prod.yaml logs -f
```

## 🛑 Stopping the Services
To shut down the production environment:
```bash
make stop-prod
```

---
> [!IMPORTANT]
> **Database Host**: In the production Docker network, use `postgres` as the hostname for the database connection from other services.
> **Redis Host**: Use `redis` as the hostname.
