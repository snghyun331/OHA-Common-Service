import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VilageForecastEntity } from './entities/vilage-fcst.entity';
import { Repository } from 'typeorm';
import { SkyType } from './enums/sky.enum';
import { PtyType } from './enums/pty.enum';
import { FreqDistrictEntity } from '../location/entities/freq-district.entity';
import { LocationService } from '../location/location.service';
import * as moment from 'moment-timezone';
import { KmaType } from './enums/kma.enum';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(VilageForecastEntity)
    private weatherRepository: Repository<VilageForecastEntity>,
    @InjectRepository(FreqDistrictEntity)
    private freqDistrictRepository: Repository<FreqDistrictEntity>,
    private locationService: LocationService,
  ) {}

  async getWeatherDatas(userId: number) {
    try {
      const { code } = await this.freqDistrictRepository.findOne({
        select: { code: true },
        where: { userId, isDefault: true },
      });
      if (!code) {
        throw new NotFoundException('default인 지역이 없습니다');
      }
      const { nx, ny } = await this.locationService.getGridByCode(code);
      const currentDateTime = moment().tz('Asia/Seoul');
      const currentDate = currentDateTime.format('YYYYMMDD');
      const currentHour = currentDateTime.format('HH:mm');
      this.logger.warn(`currentDate: ${currentDate}`);
      this.logger.warn(`currentHour: ${currentHour}`);

      const weatherInfos = await this.weatherRepository.findOne({
        where: { fcstDate: currentDate, fcstTime: currentHour + '00', nx, ny },
      });
      if (!weatherInfos) {
        throw new NotFoundException('날씨 정보가 없습니다');
      }

      const { fcstDate, fcstTime, POP, PTY, REH, SKY, TMP, WSD } = weatherInfos;
      const date = fcstDate;
      const hour = fcstTime;
      const precipPercent = POP;
      const precipType = await this.getPtyType(PTY);
      const humidity = REH;
      const sky = await this.getSkyType(SKY);
      const hourlyTemp = TMP;
      const windSpeed = WSD;
      return { date, hour, precipPercent, precipType, humidity, sky, hourlyTemp, windSpeed };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async getSkyType(sky: string) {
    if (sky === '1') {
      return SkyType.clear;
    }
    if (sky === '3') {
      return SkyType.mostlyCloudy;
    }
    if (sky === '4') {
      return SkyType.cloudy;
    }
  }

  private async getPtyType(pty: string) {
    if (pty === '0') {
      return PtyType.dry;
    }
    if (pty === '1') {
      return PtyType.rain;
    }
    if (pty === '2') {
      return PtyType.sleet;
    }
    if (pty === '3') {
      return PtyType.snow;
    }
    if (pty === '4') {
      return PtyType.shower;
    }
  }

  // 일교차 심한 지 여부 판별하는 함수 (10도 차이)

  // 강수확률 노출하는 함수

  // 일러스트 위젯 구분하는 함수
  async getIllustration(precipType, sky, hourlyTemp, windSpeed, stroke) {
    if (precipType === '1' || precipType === '4') {
      return KmaType.rain;
    }
    if (precipType === '3') {
      return KmaType.snow;
    }
    if (precipType === '2') {
      return KmaType.rainSnow;
    }
    if (stroke >= 10 && (precipType === '1' || precipType === '4')) {
      return KmaType.thunderRain;
    }
    if (windSpeed >= 9) {
      return KmaType.wind;
    }
    if (sky === '3') {
      return KmaType.mostlyCloudy;
    }
    if (sky === '4') {
      return KmaType.cloudy;
    }
    if (hourlyTemp >= 35 && sky === '1') {
      return KmaType.hot;
    }
    if (hourlyTemp < 0 && sky === '1') {
      return KmaType.cold;
    }
    if (stroke >= 10 && precipType === '0') {
      return KmaType.thunder;
    }
    return KmaType.clear;
  }
}
