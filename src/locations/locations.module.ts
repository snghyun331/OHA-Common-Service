import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictEntity } from './entities/district.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictEntity])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
