import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DATABASE_CONFIG } from 'src/config/database.config';
import { LocationModule } from 'src/module/location/location.module';
import { WeatherModule } from 'src/module/weather/weather.module';
import { SchedulerModule } from './schedule/schedule.module';
import { KafkaModule } from './kafka/kafka.module';
import { WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from 'src/config/winston.config';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(DATABASE_CONFIG),
    WinstonModule.forRoot(WINSTON_CONFIG),
    LocationModule,
    WeatherModule,
    SchedulerModule,
    KafkaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
