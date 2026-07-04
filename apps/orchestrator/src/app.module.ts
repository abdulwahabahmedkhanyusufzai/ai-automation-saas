import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [DatabaseModule, AuthModule, WorkflowsModule],
})
export class AppModule {}
