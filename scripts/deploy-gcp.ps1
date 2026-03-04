# deploy-gcp.ps1 - Windows Deployment Utility for Google Cloud Run
$ErrorActionPreference = "Stop"

try {
    # 1. Get Project ID
    $ProjectId = gcloud config get-value project 2>$null
    if ([string]::IsNullOrWhiteSpace($ProjectId)) {
        Write-Error "No GCP Project ID found. Please run 'gcloud config set project [PROJECT_ID]' first."
        exit 1
    }

    $Region = "us-central1"
    Write-Host "Using GCP Project: $ProjectId" -ForegroundColor Cyan

    # 2. Build and Push using Google Cloud Build (Serverless Build)
    Write-Host "`n[1/2] Submitting Cloud Builds..." -ForegroundColor Yellow

    Write-Host "Building Orchestrator..." -ForegroundColor Cyan
    # Use root context so it can see the Dockerfile in deployments/
    gcloud builds submit . --tag "gcr.io/$ProjectId/orchestrator" --dockerfile deployments/docker/Dockerfile.orchestrator

    Write-Host "`nBuilding Agent Engine..." -ForegroundColor Cyan
    gcloud builds submit . --tag "gcr.io/$ProjectId/agent-engine" --dockerfile deployments/docker/Dockerfile.agent

    Write-Host "`nBuilding Frontend..." -ForegroundColor Cyan
    gcloud builds submit . --tag "gcr.io/$ProjectId/frontend" --dockerfile deployments/docker/Dockerfile.frontend

    # 3. Deploy to Cloud Run
    Write-Host "`n[2/2] Deploying Services to Cloud Run..." -ForegroundColor Green

    Write-Host "Deploying Orchestrator..." -ForegroundColor Cyan
    gcloud run deploy orchestrator --image "gcr.io/$ProjectId/orchestrator" --region $Region --allow-unauthenticated --platform managed

    Write-Host "Deploying Agent Engine..." -ForegroundColor Cyan
    gcloud run deploy agent-engine --image "gcr.io/$ProjectId/agent-engine" --region $Region --allow-unauthenticated --platform managed

    Write-Host "Deploying Frontend..." -ForegroundColor Cyan
    gcloud run deploy frontend --image "gcr.io/$ProjectId/frontend" --region $Region --allow-unauthenticated --platform managed

    Write-Host "`nGCP Deployment Complete!" -ForegroundColor Green
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    Write-Host "`n[TIP] If you see a 'Billing Account' error, you must enable billing for project '$ProjectId' in the Google Cloud Console." -ForegroundColor Yellow
}
