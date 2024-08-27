import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeatherService } from './weather.service';
import { VilageForecastEntity } from '../../common/entity/weather/vilage-fcst.entity';
import { LocationService } from '../location/location.service';
import { DistrictGridEntity } from '../../common/entity/location/district-grid.entity';
import { FreqDistrictEntity } from '../../common/entity/location/freq-district.entity';
import { DistrictNameEntity } from '../../common/entity/location/district-name.entity';
import { DistrictXYEntity } from '../../common/entity/location/district-xy.entity';
import { DailyForecastEntity } from '../../common/entity/weather/daily-fcst.entity';
import { UltraSrtForecastEntity } from '../../common/entity/weather/ultra-srt-fcst.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    LocationModule,
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
