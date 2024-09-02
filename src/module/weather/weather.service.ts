import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VilageForecastEntity } from '../../common/entity/weather/vilage-fcst.entity';
import { Repository } from 'typeorm';
import { FreqDistrictEntity } from '../../common/entity/location/freq-district.entity';
import { LocationService } from '../location/location.service';
import * as moment from 'moment-timezone';
import { KmaType } from './enum/kma.enum';
import { DailyForecastEntity } from '../../common/entity/weather/daily-fcst.entity';
import { UltraSrtForecastEntity } from '../../common/entity/weather/ultra-srt-fcst.entity';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(VilageForecastEntity)
    private weatherRepository: Repository<VilageForecastEntity>,
    @InjectRepository(DailyForecastEntity)
    private dailyForecastRepository: Repository<DailyForecastEntity>,
    @InjectRepository(UltraSrtForecastEntity)
    private ultraSrtForecastRepository: Repository<UltraSrtForecastEntity>,
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
      const currentTime = currentDateTime.format('HH:mm');
      const currentHour = currentTime.slice(0, 2);

      const weatherInfos = await this.weatherRepository.findOne({
        where: { fcstDate: currentDate, fcstTime: currentHour + '00', nx, ny },
      });

      if (!weatherInfos) {
        throw new NotFoundException('날씨 정보가 없습니다');
      }

      const isTempDiffHigh = await this.isTempDiffHigh(currentDate, nx, ny);

      const { LGT: stroke } = await this.ultraSrtForecastRepository.findOne({
        select: { LGT: true },
        where: { fcstDate: currentDate, fcstTime: currentHour + '00', nx, ny },
      });

      const { POP: probPrecip, PTY: precipType, SKY: sky, TMP: hourlyTemp, WSD: windSpeed } = weatherInfos;
      const widget = await this.getIllustration(precipType, sky, hourlyTemp, windSpeed, stroke);
      if (widget === KmaType.cloudy || widget === KmaType.mostlyCloudy) {
        return { widget, probPrecip, isTempDiffHigh, hourlyTemp };
      } else {
        return { widget, isTempDiffHigh, hourlyTemp };
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // 일교차 심한 지 여부 판별하는 함수 (10도 차이)
  async isTempDiffHigh(baseDate, nx, ny) {
    const result = await this.dailyForecastRepository.findOne({ where: { fcstDate: baseDate, nx: nx, ny: ny } });
    if (!result || !result.TMN || !result.TMX) {
      return false;
    }
    if (parseInt(result.TMX) - parseInt(result.TMN) >= 10) {
      return true;
    } else {
      return false;
    }
  }

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
