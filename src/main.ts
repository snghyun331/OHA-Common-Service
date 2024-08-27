import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { WINSTON_CONFIG } from './config/winston.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TransformInterceptor } from './common/interceptor/response.interceptors';
import { setupSwagger } from './config/swagger.config';
import { eurekaClient } from './config/eureka.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ServerErrorFilter } from './common/filter/exception.filter';

async function bootstrap() {
  const winstonLogger = WinstonModule.createLogger(WINSTON_CONFIG);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: winstonLogger,
  });

  const configService: ConfigService = app.get(ConfigService);
  const env: string = configService.get<string>('NODE_ENV');
  const SERVER_PORT: number = configService.get<number>('PORT1');

  app.set('trust proxy', true);

  // cors settings
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  app.enableCors(corsOptions);

  // use global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // exception filter 적용
  app.useGlobalFilters(new ServerErrorFilter(winstonLogger));

  // winston logger setting
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // swagger setting
  setupSwagger(app);

  // run server
  try {
    await app.listen(SERVER_PORT);
    if (env === 'dev' || env === 'prod') {
      eurekaClient.logger.level('log');
      eurekaClient.start();
    }
    winstonLogger.log(`✅ Server is listening on port ${SERVER_PORT}`);
  } catch (e) {
    winstonLogger.error(e);
    winstonLogger.error('⛔️ Failed to start the app server');
  }
}
bootstrap();
