import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  // Security headers
  app.use(helmet());

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Increase body size limit for uploads
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Enable CORS
  app.enableCors({
    origin: configService.get('app.corsOrigins') || true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port =
    Number(process.env.PORT) ||
    configService.get('app.port') ||
    3000;

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // ✅ IMPORTANT FOR HOSTINGER / CLOUD DEPLOYMENTS
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Car Gate API running on port ${port}`);
  console.log(`API URL: /api`);
  console.log(`Environment: ${configService.get('app.nodeEnv')}`);
  console.log(`Started at: ${new Date().toISOString()}`);
}

bootstrap();