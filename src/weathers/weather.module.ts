import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeathersService } from './weather.service';
import { WeatherEntity } from './entities/weather.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity]), ScheduleModule.forRoot()],
  controllers: [WeathersController],
  providers: [WeathersService, TaskService],
})
export class WeathersModule {}
