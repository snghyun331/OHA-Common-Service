import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictGridEntity } from './entities/district-grid.entity';
import { DistrictNameEntity } from './entities/district-name.entity';
import { LocationsController } from './location.controller';
import { LocationService } from './location.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.access.strategy';
import { FreqDistrictEntity } from './entities/freq-district.entity';
import { HttpModule } from '@nestjs/axios';
import { DistrictXYEntity } from './entities/district-xy.entity';
import { ConsumerService } from '../kafka/kafka-consumer.service';
import { ProducerService } from '../kafka/kafka-producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictGridEntity, DistrictNameEntity, FreqDistrictEntity, DistrictXYEntity]),
    HttpModule.register({}),
  ],
  controllers: [LocationsController],
  providers: [LocationService, ConsumerService, ProducerService, JwtStrategy, Logger],
  exports: [ConsumerService, ProducerService],
})
export class LocationModule {}
