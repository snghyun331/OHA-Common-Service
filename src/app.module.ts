import { Module } from '@nestjs/common';
import { NestConfigModule } from './configs/config.module';
import { DatabaseModule } from './configs/database.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, LocationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
