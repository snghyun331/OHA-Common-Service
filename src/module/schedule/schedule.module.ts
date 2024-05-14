import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from '../weather/entities/weather.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SchdulerService } from './schedule.service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule.register({}), TypeOrmModule.forFeature([WeatherEntity])],
  controllers: [],
  providers: [SchdulerService, Logger],
})
export class SchedulerModule {}
