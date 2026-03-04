#!/bin/bash
# deploy-gcp.sh - Local to GCP Cloud Run Deployment

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo "🎯 Using GCP Project: $PROJECT_ID"

echo "🏗️ Building and Pushing Images to Google Container Registry..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/orchestrator -f deployments/docker/Dockerfile.orchestrator apps/orchestrator
gcloud builds submit --tag gcr.io/$PROJECT_ID/agent-engine -f deployments/docker/Dockerfile.agent apps/agent-engine
gcloud builds submit --tag gcr.io/$PROJECT_ID/frontend -f deployments/docker/Dockerfile.frontend apps/frontend

echo "🚀 Deploying Services to Cloud Run..."
gcloud run deploy orchestrator --image gcr.io/$PROJECT_ID/orchestrator --region $REGION --allow-unauthenticated
gcloud run deploy agent-engine --image gcr.io/$PROJECT_ID/agent-engine --region $REGION --allow-unauthenticated
gcloud run deploy frontend --image gcr.io/$PROJECT_ID/frontend --region $REGION --allow-unauthenticated

echo "✅ Deployment Complete!"
