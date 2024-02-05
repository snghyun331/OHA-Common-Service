import { Inject, Injectable, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherEntity } from './entities/weather.entity';
import { EntityManager, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { NUM_OF_ROWS, PAGE_NO } from 'src/utils/constant';
import { KoreaDate } from 'src/utils/korea-time';
import { AvailableGrids } from 'src/utils/available-grids';

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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
