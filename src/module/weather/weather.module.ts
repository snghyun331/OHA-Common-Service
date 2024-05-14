import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherEntity } from './entities/weather.entity';
import { LocationService } from '../location/location.service';
import { DistrictGridEntity } from '../location/entities/district-grid.entity';
import { FreqDistrictEntity } from '../location/entities/freq-district.entity';
import { DistrictNameEntity } from '../location/entities/district-name.entity';
import { DistrictXYEntity } from '../location/entities/district-xy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeatherEntity,
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
