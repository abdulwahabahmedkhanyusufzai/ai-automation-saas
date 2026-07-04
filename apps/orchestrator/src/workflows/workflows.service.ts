import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RedisService } from '../database/redis.service';

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000/api/v1/agent/run';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(private readonly redis: RedisService) {}

  async triggerWorkflow(instruction: string): Promise<string> {
    const taskId = Math.random().toString(36).substring(7);
    this.logger.log(`Triggering workflow task ${taskId} with instruction: ${instruction}`);

    // Set initial status in Redis
    const taskKey = `task:${taskId}`;
    await this.redis.getClient().hset(taskKey, {
      status: 'processing',
      phase: 'planning',
      live: 'Initializing plan...',
    });
    // Set 1 hour retention
    await this.redis.getClient().expire(taskKey, 3600);

    // Call Python agent engine asynchronously in the background
    this.executeAgentBackground(taskId, instruction).catch((err) => {
      this.logger.error(`Background execution error for task ${taskId}: ${err.message}`);
    });

    return taskId;
  }

  private async executeAgentBackground(taskId: string, instruction: string): Promise<void> {
    const taskKey = `task:${taskId}`;
    try {
      const response = await fetch(AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: taskId,
          instruction: instruction,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent engine returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Update task completion state in Redis
      await this.redis.getClient().hset(taskKey, {
        status: 'completed',
        phase: 'completed',
        result: JSON.stringify({ final_result: data.final_result }),
      });
      this.logger.log(`Task ${taskId} completed successfully`);
    } catch (err: any) {
      this.logger.error(`Failed to process task ${taskId} in background: ${err.message}`);
      await this.redis.getClient().hset(taskKey, {
        status: 'error',
        phase: 'error',
        result: JSON.stringify({ error: err.message || 'Workflow execution failed' }),
      });
    }
  }

  async updateProgress(taskId: string, phase: string, message: string): Promise<void> {
    const taskKey = `task:${taskId}`;
    this.logger.log(`[Progress Update] Task ${taskId} -> Phase: ${phase}, length: ${message.length}`);
    await this.redis.getClient().hset(taskKey, {
      phase: phase,
      live: message,
    });
  }

  async getWorkflowStatus(taskId: string): Promise<any> {
    const taskKey = `task:${taskId}`;
    const taskData = await this.redis.getClient().hgetall(taskKey);

    if (!taskData || Object.keys(taskData).length === 0) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    if (taskData.status === 'completed') {
      let resultObj = {};
      try {
        resultObj = JSON.parse(taskData.result);
      } catch (e) {
        resultObj = { final_result: taskData.result };
      }
      return {
        status: 'completed',
        data: resultObj,
        phase: 'completed',
      };
    }

    if (taskData.status === 'error') {
      let resultObj = {};
      try {
        resultObj = JSON.parse(taskData.result);
      } catch (e) {
        resultObj = { error: taskData.result };
      }
      return {
        status: 'error',
        data: resultObj,
        phase: 'error',
      };
    }

    return {
      status: 'processing',
      phase: taskData.phase || 'planning',
      live: taskData.live || '',
    };
  }
}
