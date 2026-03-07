variable "aws_region" {
  description = "AWS region to deploy into"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name tag"
  default     = "agentic-saas"
}

variable "db_password" {
  description = "Database password (RDS)"
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key for JWT generation (Go Orchestrator)"
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API Key (AI Agent)"
  sensitive   = true
}

variable "next_public_google_client_id" {
  description = "Next.js frontend Google OAuth client ID"
  type        = string
  default     = ""
}

variable "next_public_github_client_id" {
  description = "Next.js frontend GitHub OAuth client ID"
  type        = string
  default     = ""
}
