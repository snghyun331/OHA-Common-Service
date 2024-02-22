import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { EurekaModule } from 'nestjs-eureka';
import { Eureka_Heartbeat_Interval, Eureka_Registery_Interval } from 'src/utils/constant';
import { winstonLogger } from './winston.config';
// const env = process.env.NODE_ENV;

@Module({
  imports: [
    EurekaModule.forRootAsync({
      imports: [ConfigModule, WinstonModule],
      useFactory: async (configService: ConfigService) => ({
        service: {
          // name: `common-service${env === 'prod' ? '-dev' : ''}`,
          name: 'common-service-dev',
          port: +configService.get('PORT1') || +configService.get('PORT2'),
          host: configService.get('HOST'),
        },
        eureka: {
          host: configService.get('Eureka_HOST'),
          port: +configService.get('Eureka_PORT'),
          servicePath: '/eureka/apps/',
          registryFetchInterval: Eureka_Registery_Interval,
          heartbeatInterval: Eureka_Heartbeat_Interval,
          logger: winstonLogger,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EurekaModule],
})
export class ServiceDiscoveryModule {}
