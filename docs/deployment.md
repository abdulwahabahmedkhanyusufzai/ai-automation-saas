# Deployment Guide 🚀

This document outlines how to deploy the **AgenticSaaS** stack from the terminal using Docker.

## 📋 Prerequisites
- **Docker & Docker Compose** installed.
- **Azure CLI (az)** installed and logged in (`az login`).
- **Terraform** installed (optional for infra automation).
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
---

## ☁️ Cloud Deployment (Microsoft Azure)
The project is optimized for **Azure Container Apps (ACA)** and **Azure Database for PostgreSQL**.

### 1. Prerequisites
- **Azure Subscription** active.
- **Resource Group** and **Container Registry (ACR)** created.

### 2. Fast Deployment (Local Terminal)
Use the provided script to build and deploy everything in one go:

**On Windows (PowerShell):**
```powershell
# Ensure you are logged in
az login

# Run the deployment script
.\scripts\deploy-azure.ps1
```

### 3. Infrastructure as Code (Terraform)
Automate your Azure setup (PostgreSQL, Container Apps Environment):
1. `cd infra/terraform`
2. `terraform init`
3. `terraform apply -var="db_password=[YOUR_PWD]"`

### 4. Automated CI/CD (GitHub Actions)
The workflow at `.github/workflows/deploy-azure.yml` handles:
1. Azure Login using Service Principal.
2. Building and pushing to ACR.
3. Updating Container App revisions.

> [!TIP]
> **Scaling**: Azure Container Apps are built on K8s but feel like serverless. They can scale from 0 to many based on HTTP traffic or queue depth.



