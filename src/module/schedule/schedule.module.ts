import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VilageForecastEntity } from '../weather/entities/vilage-fcst.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SchdulerService } from './schedule.service';
import { DailyForecastEntity } from '../weather/entities/daily-fcst.entity';
import { UltraSrtForecastEntity } from '../weather/entities/ultra-srt-fcst.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.register({}),
    TypeOrmModule.forFeature([VilageForecastEntity, DailyForecastEntity, UltraSrtForecastEntity]),
  ],
  controllers: [],
  providers: [SchdulerService, Logger],
})
export class SchedulerModule {}
