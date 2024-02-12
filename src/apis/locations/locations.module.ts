import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictGridEntity } from './entities/district-grid.entity';
import { DistrictNameEntity } from './entities/district-name.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { FreqDistrictEntity } from './entities/freq-district.entity';
import { HttpModule } from '@nestjs/axios';
import { DistrictXYEntity } from './entities/district-xy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictGridEntity, DistrictNameEntity, FreqDistrictEntity, DistrictXYEntity]),
    HttpModule.register({}),
  ],
  controllers: [LocationsController],
  providers: [LocationsService, JwtStrategy, Logger],
})
export class LocationsModule {}
