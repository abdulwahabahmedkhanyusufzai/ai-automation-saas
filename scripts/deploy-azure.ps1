# deploy-azure.ps1 - Windows Deployment Utility for Azure Container Apps
$ErrorActionPreference = "Continue"

try {
    # 1. Configuration - PIVOTING TO EASTASIA
    $ResourceGroup = "rg-agentic-saas"
    $AcrName = "acragenticsaas" # MUST BE GLOBALLY UNIQUE!
    $EnvName = "cae-agentic-saas"
    $Location = "eastasia" # Trying a different region that often works better for students

    Write-Host "Targeting Azure Resource Group: $ResourceGroup in $Location" -ForegroundColor Cyan

    # 2. Register required Azure Providers (CRITICAL)
    Write-Host "`n[0/3] Registering Azure Providers (this can take 2-3 minutes)..." -ForegroundColor Yellow
    az provider register -n Microsoft.App --wait
    az provider register -n Microsoft.OperationalInsights --wait
    az provider register -n Microsoft.ContainerRegistry --wait

    # 3. Create Infrastructure if it doesn't exist
    Write-Host "`n[1/3] Verifying Infrastructure..." -ForegroundColor Yellow
    
    # Check if we need to move regions
    $rgExists = az group exists --name $ResourceGroup
    if ($rgExists -eq "true") {
        $existingPos = az group show --name $ResourceGroup --query location -o tsv
        if ($existingPos -ne $Location) {
            Write-Host "Deleting old Resource Group in $existingPos to move to $Location..." -ForegroundColor Yellow
            az group delete --name $ResourceGroup --yes --no-wait
            Write-Host "Waiting 30 seconds for cleanup..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
        }
    }

    $rgCheck = az group exists --name $ResourceGroup
    if ($rgCheck -eq "false") {
        Write-Host "Creating Resource Group: $ResourceGroup in $Location..." -ForegroundColor Cyan
        az group create --name $ResourceGroup --location $Location
    }

    $acrCheck = az acr list --resource-group $ResourceGroup --query "[?name=='$AcrName']" -o tsv
    if ([string]::IsNullOrWhiteSpace($acrCheck)) {
        Write-Host "Creating Container Registry: $AcrName..." -ForegroundColor Cyan
        az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic --admin-enabled true --location $Location
    }

    $envCheck = az containerapp env list --resource-group $ResourceGroup --query "[?name=='$EnvName']" -o tsv
    if ([string]::IsNullOrWhiteSpace($envCheck)) {
        Write-Host "Creating Container App Environment: $EnvName..." -ForegroundColor Cyan
        az containerapp env create --name $EnvName --resource-group $ResourceGroup --location $Location
    }

    # 4. Cloud Build and Push
    Write-Host "`n[2/3] Submitting Cloud Builds to ACR..." -ForegroundColor Yellow
    
    Write-Host "Building Orchestrator..." -ForegroundColor Cyan
    az acr build --registry $AcrName --image "orchestrator:latest" -f deployments/docker/Dockerfile.orchestrator apps/orchestrator

    Write-Host "`nBuilding Agent Engine..." -ForegroundColor Cyan
    az acr build --registry $AcrName --image "agent-engine:latest" -f deployments/docker/Dockerfile.agent apps/agent-engine

    Write-Host "`nBuilding Frontend..." -ForegroundColor Cyan
    az acr build --registry $AcrName --image "frontend:latest" -f deployments/docker/Dockerfile.frontend apps/frontend

    # 5. Deploy/Update Container Apps
    Write-Host "`n[3/3] Updating Azure Container Apps..." -ForegroundColor Green
    $AcrServer = "$AcrName.azurecr.io"

    function Deploy-Service($ServiceName, $Image, $Port) {
        $check = az containerapp list --resource-group $ResourceGroup --query "[?name=='$ServiceName']" -o tsv
        if ([string]::IsNullOrWhiteSpace($check)) {
            Write-Host "Creating Service: $ServiceName..." -ForegroundColor Cyan
            az containerapp create --name $ServiceName --resource-group $ResourceGroup --environment $EnvName --image $Image --target-port $Port --ingress external
        } else {
            Write-Host "Updating Service: $ServiceName..." -ForegroundColor Cyan
            az containerapp update --name $ServiceName --resource-group $ResourceGroup --image $Image
        }
    }

    Deploy-Service "ca-orchestrator" "$AcrServer/orchestrator:latest" 8080
    Deploy-Service "ca-agent-engine" "$AcrServer/agent-engine:latest" 8000
    Deploy-Service "ca-frontend" "$AcrServer/frontend:latest" 3000

    Write-Host "`nAzure Deployment Complete!" -ForegroundColor Green
}
catch {
    Write-Error "Deployment failed."
    Write-Host "`n[TIP] If you get 'TasksOperationsNotAllowed', your student account is locked out of Cloud Builds." -ForegroundColor Yellow
    Write-Host "[SOLUTION] Push your code to GitHub and use the GitHub Actions workflow I created!" -ForegroundColor Green
}
