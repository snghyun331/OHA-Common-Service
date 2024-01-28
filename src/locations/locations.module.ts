import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictGridEntity } from './entities/district-grid.entity';
import { DistrictNameEntity } from './entities/district-name.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictGridEntity, DistrictNameEntity])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
