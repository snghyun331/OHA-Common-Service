import { BadRequestException, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async validate(req: Request) {
    try {
      const userToken = req.headers['authorization']?.slice(7);
      if (!userToken) {
        throw new BadRequestException('There is no access token in header');
      }
      const secretKey = this.configService.get('JWT_SECRET_KEY');
      const payload = jwt.verify(userToken, secretKey);
      return payload;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
