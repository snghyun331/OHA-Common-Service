import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeathersService } from './weather.service';
import { WeatherEntity } from './entities/weather.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity]), ScheduleModule.forRoot(), HttpModule.register({})],
  controllers: [WeathersController],
  providers: [WeathersService, TaskService, Logger],
})
export class WeathersModule {}
