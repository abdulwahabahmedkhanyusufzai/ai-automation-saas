# deploy.ps1 - Windows Deployment Utility for AgenticSaaS
param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("build-prod", "deploy-prod", "stop-prod", "run-infra")]
    $Action = "help"
)

$ProdComposeFile = "deployments/docker/docker-compose.prod.yaml"

switch ($Action) {
    "build-prod" {
        Write-Host "🏗️ Building Production Docker Images..." -ForegroundColor Cyan
        docker-compose -f $ProdComposeFile build
    }
    "deploy-prod" {
        Write-Host "🚀 Deploying Stack in Production Mode..." -ForegroundColor Green
        docker-compose -f $ProdComposeFile up -d
    }
    "stop-prod" {
        Write-Host "🛑 Stopping Production Stack..." -ForegroundColor Red
        docker-compose -f $ProdComposeFile down
    }
    "run-infra" {
        Write-Host "🗄️ Starting Infrastructure (Postgres/Redis)..." -ForegroundColor Yellow
        docker-compose up -d
    }
    "help" {
        Write-Host "AgenticSaaS Deployment Utility (Windows Powerhell)" -ForegroundColor Magenta
        Write-Host "Usage: .\scripts\deploy.ps1 -Action [action]"
        Write-Host "Actions: build-prod, deploy-prod, stop-prod, run-infra"
    }
}
