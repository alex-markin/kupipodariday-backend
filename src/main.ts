// Core and app module
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Common utilities
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Logging
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// Swagger
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './configuration/swagger.config';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(port);
}
bootstrap();
