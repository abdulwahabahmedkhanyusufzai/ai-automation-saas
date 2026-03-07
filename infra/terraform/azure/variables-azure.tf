variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  default     = "rg-agentic-saas"
}

variable "location" {
  description = "Azure region"
  default     = "East US"
}

variable "acr_name" {
  description = "Azure Container Registry name (must be unique)"
  default     = "acragenticsaas"
}

variable "db_password" {
  description = "PostgreSQL admin password"
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT Secret for Go Orchestrator"
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API Key for AI Agent"
  sensitive   = true
}
