.PHONY: help install run-infra run-orch run-agent run-frontend dev

help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies for all apps"
	@echo "  run-infra    - Start database and redis (Docker)"
	@echo "  run-orch     - Run Go Orchestrator"
	@echo "  run-agent    - Run Python Agent Engine"
	@echo "  run-frontend - Run Next.js Frontend"
	@echo "  dev          - Run all services (locally, multiple terminals needed)"
	@echo ""
	@echo "Production Deployment (Docker):"
	@echo "  build-prod   - Build production Docker images"
	@echo "  deploy-prod  - Run the entire stack in production mode"
	@echo "  stop-prod    - Stop the production stack"

install:
	cd apps/frontend && npm install
	cd apps/orchestrator && go mod download
	cd apps/agent-engine && pip install -r requirements.txt

run-infra:
	docker-compose up -d

run-orch:
	cd apps/orchestrator && go run cmd/orchestrator/main.go

run-agent:
	cd apps/agent-engine && python src/main.py

run-frontend:
	cd apps/frontend && npm run dev

dev:
	@echo "Starting services..."
	@echo "Use separate terminals to run each service for better log tracking."
	@echo "1. make run-infra"
	@echo "2. make run-orch"
	@echo "3. make run-agent"
	@echo "4. make run-frontend"

# Production Deployment (Terminal)
build-prod:
	docker-compose -f deployments/docker/docker-compose.prod.yaml build

deploy-prod:
	docker-compose -f deployments/docker/docker-compose.prod.yaml up -d

stop-prod:
	docker-compose -f deployments/docker/docker-compose.prod.yaml down

