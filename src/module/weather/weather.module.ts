import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeatherService } from './weather.service';
import { VilageForecastEntity } from './entities/vilage-fcst.entity';
import { LocationService } from '../location/location.service';
import { DistrictGridEntity } from '../location/entities/district-grid.entity';
import { FreqDistrictEntity } from '../location/entities/freq-district.entity';
import { DistrictNameEntity } from '../location/entities/district-name.entity';
import { DistrictXYEntity } from '../location/entities/district-xy.entity';
import { DailyForecastEntity } from './entities/daily-fcst.entity';
import { UltraSrtForecastEntity } from './entities/ultra-srt-fcst.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VilageForecastEntity,
      DailyForecastEntity,
      UltraSrtForecastEntity,
      DistrictGridEntity,
      FreqDistrictEntity,
      DistrictNameEntity,
      DistrictXYEntity,
    ]),
  ],
  controllers: [WeathersController],
  providers: [WeatherService, Logger, LocationService],
})
export class WeatherModule {}
