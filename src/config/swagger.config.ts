import { DocumentBuilder } from '@nestjs/swagger';

export class SwaggerConfig {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('OHA-Common')
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
  }
}
