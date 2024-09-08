import { ConfigModule, ConfigService } from '@nestjs/config';
import * as https from 'https';

export const AXIOS_CONFIG = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    timeout: configService.get<number>('AXIOS_TIMEOUT'),
    maxRedirects: configService.get<number>('AXIOS_MAX_REDIRECTS'),
    httpsAgent: new https.Agent({ keepAlive: true }),
  }),
};
