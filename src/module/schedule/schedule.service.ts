import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { NUM_OF_ROWS, PAGE_NO } from 'src/utils/constant';
import { AvailableGrids } from 'src/utils/available-grids';
import * as moment from 'moment-timezone';
import { WeatherEntity } from '../weather/entities/weather.entity';

@Injectable()
export class SchdulerService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  @Cron('10 59 21 * * *')
  async insertWeatherEveryDay() {
    this.logger.log('Start Insert!');
    await this.insertWeather();
  }

  private async insertWeather() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const numOfRows = NUM_OF_ROWS;
      const pageNo = PAGE_NO;
      const currentDateTime = moment().tz('Asia/Seoul');
      const baseDate = currentDateTime.format('YYYYMMDD');
      const currentHour = parseInt(currentDateTime.format('HH:mm'), 10);
      console.log('currentHour', currentHour);
      let baseTime;
      if (currentHour >= 17) {
        baseTime = '1700';
      } else {
        baseTime = '0500';
      }

      const grids = AvailableGrids;

      while (grids.length !== 0) {
        const grid = grids.shift();
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${this.configService.get('WEATHER_KEY')}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        const res = await lastValueFrom(this.httpService.get(apiUrl));

        await this.delay(500);

        const datas = res.data.response?.body?.items?.item;
        if (!datas) {
          grids.push(grid);
          continue;
        }
        const groupedData = datas.reduce((acc, item) => {
          if (!item.fcstDate || !item.fcstTime || !item.nx || !item.ny || !item.category || !item.fcstValue) {
            grids.push(grid);
            return;
          }
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
          try {
            await queryRunner.manager.save(weatherData);
          } catch (e) {
            this.logger.error(e);
            this.logger.error(`${JSON.stringify(weatherData)}`);
            throw e;
          }
        }
      }
      await queryRunner.commitTransaction();
      this.logger.log(`InsertJob Finished!! at ${moment().tz('Asia/Seoul')}`);
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(e);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
