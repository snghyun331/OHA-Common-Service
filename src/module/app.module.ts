import { Module } from '@nestjs/common';
import { NestConfigModule } from 'src/config/config.config';
import { DatabaseModule } from 'src/config/database.config';
import { LocationModule } from 'src/module/location/location.module';
import { WeatherModule } from 'src/module/weather/weather.module';
import { SchedulerModule } from './schedule/schedule.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, LocationModule, WeatherModule, SchedulerModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
