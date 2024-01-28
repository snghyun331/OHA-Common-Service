import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeathersController } from './weather.controller';
import { WeathersService } from './weather.service';
import { WeatherEntity } from './entities/weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity])],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
