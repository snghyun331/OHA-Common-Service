import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VilageForecastEntity } from '../../common/entity/weather/vilage-fcst.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SchdulerService } from './schedule.service';
import { DailyForecastEntity } from '../../common/entity/weather/daily-fcst.entity';
import { UltraSrtForecastEntity } from '../../common/entity/weather/ultra-srt-fcst.entity';

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
