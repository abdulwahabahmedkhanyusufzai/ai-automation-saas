# ECS Fargate Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# IAM Role for ECS Tasks (Execution Role)
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecsExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- Service Definitions ---

# 1. Orchestrator Service (Go)
resource "aws_ecs_task_definition" "orchestrator" {
  family                   = "orchestrator-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "orchestrator"
      image     = "agentic-saas/orchestrator:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [{
        containerPort = 8080
        hostPort      = 8080
      }]
      environment = [
        { name = "DB_HOST", value = "postgres.local" },
        { name = "REDIS_ADDR", value = "redis.local:6379" }
      ]
      secrets = [{ name = "JWT_SECRET", valueFrom = "arn:aws:ssm:..." }]
    }
  ])
}

# 2. Agent Engine Service (Python)
resource "aws_ecs_task_definition" "agent_engine" {
  family                   = "agent-engine-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "agent-engine"
      image     = "agentic-saas/agent-engine:latest"
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [{
        containerPort = 8000
        hostPort      = 8000
      }]
      secrets = [{ name = "GOOGLE_API_KEY", valueFrom = "arn:aws:ssm:..." }]
    }
  ])
}

# --- ALB (Load Balancer) ---
# Placeholder for Application Load Balancer logic...
# In a real cloud env, you would route /api/* to Orchestrator and /* to Frontend.
