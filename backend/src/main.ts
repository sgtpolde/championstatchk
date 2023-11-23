import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
  });

  const options = new DocumentBuilder()
    .setTitle('Twistora - champion stats checker')
    .setDescription('API documentation for Twistora - champion stats checker')
    .setVersion('1.0')
    .setContact('SgtPolde', 'https://skurjen.si', 'zak.bbrsek@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('', app, document, {
    customSiteTitle: 'Twistora - championstatchk Documentation',
    customCss: `
    /* Set light background */
    body {
      background-color: #f5f5f5;
    }

    /* Set high contrast */
    .swagger-ui .topbar, .swagger-ui .scheme-container {
      display: none;
    }

    .swagger-ui .info .title {
      color: #333;
    }

    .swagger-ui .info {
      background-color: #fff;
      color: #333;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px; /* Add padding */
    }

    /* Customize colors and other styles as needed */
  `,
    swaggerOptions: {
      docExpansion: 'list', // Controls how the API listing is displayed
      filter: false, // Enables filtering in the UI
      showRequestDuration: true, // Shows the request duration in the UI
      // Add more Swagger UI options as needed
    },
  });
  await app.listen(8000);
}
bootstrap();
