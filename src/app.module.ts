import { Module } from '@nestjs/common';
import { NestConfigModule } from './configs/config.module';
import { DatabaseModule } from './configs/database.module';
import { LocationsModule } from './locations/locations.module';
import { WeathersModule } from './weathers/weather.module';
import { ServiceDiscoveryModule } from './configs/eureka.module';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    NestConfigModule,
    DatabaseModule,
    LocationsModule,
    WeathersModule,
    env === 'dev' ? null : ServiceDiscoveryModule,
  ].filter((module) => module),
  controllers: [],
  providers: [],
})
export class AppModule {}
