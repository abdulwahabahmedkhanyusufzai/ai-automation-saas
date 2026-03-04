#!/bin/bash
# deploy-cloud.sh - Cloud Deployment Script for Linux/Ubuntu runners

# --- CONFIGURATION (Environment Variables) ---
AWS_REGION="us-east-1"
ECR_REPO_ORCH="agentic-saas/orchestrator"
ECR_REPO_AGENT="agentic-saas/agent-engine"
ECR_REPO_FE="agentic-saas/frontend"

# --- DEPLOYMENT FLOW ---

echo "🏗️ Building Cloud-Ready Docker Images..."
docker build -t $ECR_REPO_ORCH -f deployments/docker/Dockerfile.orchestrator apps/orchestrator
docker build -t $ECR_REPO_AGENT -f deployments/docker/Dockerfile.agent apps/agent-engine
docker build -t $ECR_REPO_FE -f deployments/docker/Dockerfile.frontend apps/frontend

echo "🔐 Infrastructure Check (Terraform)..."
cd infra/terraform
terraform init
terraform plan

echo "🚀 Ready to deploy! Run 'terraform apply' to provision AWS resources."
