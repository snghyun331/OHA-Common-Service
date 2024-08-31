import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: -1,
  },
};

export function setupSwagger(app: INestApplication): void {
  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('OHA-COMMON')
      .setDescription('OHA-COMMON API Swagger 문서')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          name: 'AccessToken',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/common/swagger', app, document, swaggerCustomOptions);
  }
}
