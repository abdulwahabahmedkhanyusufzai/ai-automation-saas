variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  default     = "us-central1"
}

variable "jwt_secret" {
  description = "JWT Secret for Go Orchestrator"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API Key for AI Agent"
  type        = string
  sensitive   = true
}
