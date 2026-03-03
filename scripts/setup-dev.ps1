# setup-dev.ps1 - Development Environment Initializer for Windows
Write-Host "🚀 Initializing AgenticSaaS Developer Environment..." -ForegroundColor Cyan

# 1. Install Node.js dependencies
Write-Host "`n[1/3] Installing Frontend Dependencies..." -ForegroundColor Yellow
cd apps/frontend
npm install
cd ../..

# 2. Setup Python Virtual Environment
Write-Host "`n[2/3] Setting up Python Agent Engine (Venv)..." -ForegroundColor Yellow
if (!(Test-Path "apps/agent-engine/venv")) {
    python -m venv apps/agent-engine/venv
}
& apps/agent-engine/venv/Scripts/Activate.ps1
pip install -r apps/agent-engine/requirements.txt
deactivate

# 3. Go Modules
Write-Host "`n[3/3] Downloading Go Orchestrator Modules..." -ForegroundColor Yellow
cd apps/orchestrator
go mod download
cd ../..

Write-Host "`n✅ Environment Ready! Use 'make run-infra' to start Docker, then your services." -ForegroundColor Green
