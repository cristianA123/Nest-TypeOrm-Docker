import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { RequestMethod, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global-filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = new Logger('bootstrap');

  logger.log(`Application is running in ${process.env.PORT} mode`);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Hotel App')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization (Access Token)',
        description: 'Enter Access Token',
        in: 'header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization (Refresh Token)',
        description: 'Enter Refresh Token',
        in: 'header',
      },
      'refresh-token',
    )
    /* .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'http://localhost:3000/api/v1/auth/login',
            scopes: {
              'read:hotels': 'Read hotels',
              'write:hotels': 'Write hotels',
            },
          },
        },
      },
      'oauth2',
    ) */
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
