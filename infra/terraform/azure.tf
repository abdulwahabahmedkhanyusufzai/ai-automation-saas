provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# --- Azure Container Registry ---
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# --- Container App Environment ---
resource "azurerm_container_app_environment" "main" {
  name                       = "cae-agentic-saas"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
}

# --- Azure Database for PostgreSQL ---
resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "psql-agentic-saas"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  administrator_login    = "psqladmin"
  administrator_password = var.db_password
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
}

# --- Azure Container Apps (Services) ---

# 1. Orchestrator (Go)
resource "azurerm_container_app" "orchestrator" {
  name                         = "ca-orchestrator"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "orchestrator"
      image  = "${azurerm_container_registry.acr.login_server}/orchestrator:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.db.fqdn
      }
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage = 100
      latest_revision = true
    }
  }
}

# 2. Agent Engine (Python)
resource "azurerm_container_app" "agent_engine" {
  name                         = "ca-agent-engine"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "agent-engine"
      image  = "${azurerm_container_registry.acr.login_server}/agent-engine:latest"
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "GOOGLE_API_KEY"
        value = var.gemini_api_key
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8000
    traffic_weight {
      percentage = 100
      latest_revision = true
    }
  }
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "orchestrator_url" {
  value = azurerm_container_app.orchestrator.latest_revision_fqdn
}
