import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  console.log(`[API] Starting BistroOS NestJS Orchestrator on port ${port}...`);
  await app.listen(port);
}
bootstrap();
