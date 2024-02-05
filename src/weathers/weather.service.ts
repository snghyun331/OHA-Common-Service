import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherEntity } from './entities/weather.entity';
import { EntityManager, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { NUM_OF_ROWS, PAGE_NO } from 'src/utils/constant';
import { KoreaDate } from 'src/utils/korea-time';
import { AvailableGrids } from 'src/utils/available-grids';
import { GetDataDto } from './dto/get-data.dto';
import { SkyType } from './enums/sky.enum';
import { PtyType } from './enums/pty.enum';

@Injectable()
export class WeathersService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(WeatherEntity)
    private weatherRepository: Repository<WeatherEntity>,
    private readonly httpService: HttpService,
  ) {}

  async insertWeather(transactionManager: EntityManager) {
    try {
      const numOfRows = NUM_OF_ROWS;
      const pageNo = PAGE_NO;
      const koreaFullDate = new KoreaDate();
      const baseDate = koreaFullDate.getFullDate();

      let baseTime;
      if (koreaFullDate.getFullTime().slice(0, 2) == '17') {
        baseTime = '1700';
      } else {
        baseTime = '0500';
      }

      const grids = AvailableGrids;

      for (const grid of grids) {
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.WEATHER_KEY}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        console.log(apiUrl);
        const res = await lastValueFrom(this.httpService.get(apiUrl));

        // 1초 대기
        // await this.delay(1000);

        const datas = res.data.response?.body.items.item;
        if (!datas) {
          continue;
        }
        const groupedData = datas.reduce((acc, item) => {
          const key = `${item.fcstDate}_${item.fcstTime}`;
          if (!acc[key]) {
            acc[key] = { fcstDate: item.fcstDate, fcstTime: item.fcstTime, nx: item.nx, ny: item.ny };
          }
          acc[key][item.category] = item.fcstValue;
          return acc;
        }, {});

        const dataArray = Object.values(groupedData);
        for (const data of dataArray) {
          const weatherData = new WeatherEntity();
          Object.assign(weatherData, data);
          await transactionManager.save(weatherData);
        }
      }
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getDatas(dto: GetDataDto) {
    const { nx, ny } = dto;
    const koreaFullDate = new KoreaDate();
    // const currentDate = koreaFullDate.getFullDate();
    // const currentHour = koreaFullDate.getFullTime().slice(0, 2);
    const currentDate = '20240205';
    const currentHour = '17';
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
  }

  private async getSkyType(sky: string) {
    if (sky === '1') {
      return SkyType.clear;
    } else if (sky === '3') {
      return SkyType.mostlyCloudy;
    } else if (sky === '4') {
      return SkyType.cloudy;
    } else {
      return 'No Provided';
    }
  }

  private async getPtyType(pty: string) {
    if (pty === '0') {
      return PtyType.dry;
    } else if (pty === '1') {
      return PtyType.rain;
    } else if (pty === '2') {
      return PtyType.sleet;
    } else if (pty === '3') {
      return PtyType.snow;
    } else if (pty === '4') {
      return PtyType.shower;
    } else {
      return 'No Provided';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
