import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeathersService } from './weather.service';
import { WeatherEntity } from './entities/weather.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { HttpModule } from '@nestjs/axios';
import { LocationsService } from 'src/locations/locations.service';
import { DistrictGridEntity } from 'src/locations/entities/district-grid.entity';
import { FreqDistrictEntity } from 'src/locations/entities/freq-district.entity';
import { DistrictNameEntity } from 'src/locations/entities/district-name.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherEntity, DistrictGridEntity, FreqDistrictEntity, DistrictNameEntity]),
    ScheduleModule.forRoot(),
    HttpModule.register({}),
  ],
  controllers: [WeathersController],
  providers: [WeathersService, TaskService, Logger, LocationsService],
})
export class WeathersModule {}
