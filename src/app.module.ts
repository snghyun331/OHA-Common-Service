import { Module } from '@nestjs/common';
import { NestConfigModule } from './configs/config.module';
import { DatabaseModule } from './configs/database.module';

@Module({
  imports: [NestConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
