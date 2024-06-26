import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { winstonLogger } from './config/winston.config';
import * as morgan from 'morgan';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TransformInterceptor } from './interceptor/response.interceptors';
import { SwaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { eurekaClient } from './config/eureka.config';

const port = process.env.PORT1 || process.env.PORT2;
const env = process.env.NODE_ENV;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // cors settings
  const corsOptions: CorsOptions = {
    credentials: true,
  };
  app.enableCors(corsOptions);

  // app.use(morgan('combined'));  // product
  app.use(morgan('dev')); // dev

  // use global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // run swagger
  const config = new SwaggerConfig().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/common/swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // run server
  try {
    await app.listen(port);
    if (env === 'product') {
      eurekaClient.logger.level('log');
      eurekaClient.start();
    }
    winstonLogger.log(`Server is listening on port ${port} successfully`);
  } catch (e) {
    winstonLogger.error(e);
    winstonLogger.error('Failed to start the app server');
  }
}
bootstrap();
