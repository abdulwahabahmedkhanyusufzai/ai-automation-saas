provider "google" {
  project = var.project_id
  region  = var.region
}

# --- Cloud SQL (PostgreSQL) ---
resource "google_sql_database_instance" "main" {
  name             = "saas-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
  }
}

# --- Cloud Run Services (Serverless) ---

# 1. Orchestrator Service (Go)
resource "google_cloud_run_v2_service" "orchestrator" {
  name     = "orchestrator"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/orchestrator:latest"
      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.main.public_ip_address
      }
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
    }
  }
}

# 2. Agent Engine Service (Python)
resource "google_cloud_run_v2_service" "agent_engine" {
  name     = "agent-engine"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/agent-engine:latest"
      env {
        name  = "GOOGLE_API_KEY"
        value = var.gemini_api_key
      }
    }
  }
}

# --- outputs ---
output "orchestrator_url" {
  value = google_cloud_run_v2_service.orchestrator.uri
}
