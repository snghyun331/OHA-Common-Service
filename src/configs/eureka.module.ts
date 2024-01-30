import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EurekaModule } from 'nestjs-eureka';
import { SERVER_PORT, SERVER_PORT_2 } from 'src/utils/constant';

// const env = process.env.NODE_ENV;
const port = SERVER_PORT || SERVER_PORT_2;

@Module({
  imports: [
    EurekaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        service: {
          // name: `user-service${env === 'prod' ? '-dev' : ''}`,
          name: 'common-service-dev',
          port: port,
          host: configService.get('HOST'),
        },
        eureka: {
          host: configService.get('Eureka_HOST'),
          port: +configService.get('Eureka_PORT'),
          servicePath: '/eureka/apps/',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EurekaModule],
})
export class ServiceDiscoveryModule {}
