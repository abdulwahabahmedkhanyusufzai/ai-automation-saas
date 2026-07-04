import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('api/v1')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post('workflows/trigger')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async triggerWorkflow(@Body() body: any) {
    const taskId = await this.workflowsService.triggerWorkflow(body.instruction);
    return { message: 'Workflow queued', task_id: taskId };
  }

  @Get('workflows/status/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getWorkflowStatus(@Param('id') id: string) {
    return this.workflowsService.getWorkflowStatus(id);
  }

  @Post('internal/progress')
  @HttpCode(HttpStatus.OK)
  async updateProgress(@Body() body: any) {
    await this.workflowsService.updateProgress(body.task_id, body.phase, body.message);
    return { status: 'success' };
  }
}
