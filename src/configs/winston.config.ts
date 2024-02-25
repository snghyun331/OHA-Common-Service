import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment-timezone';

const env = process.env.NODE_ENV;

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'product' ? 'log' : 'verbose',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
        }),
        winston.format.colorize(),
        utilities.format.nestLike('COMMON', { prettyPrint: true }),
      ),
    }),
  ],
});
