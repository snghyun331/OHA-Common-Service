import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EurekaModule, EurekaModuleOptions, EurekaModuleClientLogger } from 'nestjs-eureka';

// const env = process.env.NODE_ENV;

@Module({
  imports: [
    EurekaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<EurekaModuleOptions> => ({
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
        },
        clientLogger: {
          warn: console.warn,
          info: console.info,
          error: console.error,
        } as EurekaModuleClientLogger,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EurekaModule],
})
export class ServiceDiscoveryModule {}
