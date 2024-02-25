import { Module } from '@nestjs/common';
import { NestConfigModule } from './configs/config.module';
import { DatabaseModule } from './configs/database.module';
import { LocationsModule } from './apis/locations/locations.module';
import { WeathersModule } from './apis/weathers/weather.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, LocationsModule, WeathersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
