import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { NUM_OF_ROWS, PAGE_NO } from 'src/utils/constant';
import { AvailableGrids } from 'src/utils/available-grids';
import * as moment from 'moment-timezone';
import { VilageForecastEntity } from '../weather/entities/vilage-fcst.entity';
import { UltraSrtForecastEntity } from '../weather/entities/ultra-srt-fcst.entity';
import { DailyForecastEntity } from '../weather/entities/daily-fcst.entity';

@Injectable()
export class SchdulerService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  /* 단기예보 데이터 넣는 함수*/
  @Cron('0 15 5,17 * * *')
  async insertVilageForecast() {
    this.logger.log('Start Insert VilageForecast!!');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const numOfRows = NUM_OF_ROWS;
      const pageNo = PAGE_NO;
      const currentDateTime = moment().tz('Asia/Seoul');
      const baseDate = currentDateTime.format('YYYYMMDD');
      const currentHour = parseInt(currentDateTime.format('HH:mm'), 10);

      let baseTime;
      if (currentHour >= 17) {
        baseTime = '1700';
      } else {
        baseTime = '0500';
      }

      const grids = AvailableGrids;
      const results: VilageForecastEntity[] = [];
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
          const weatherData = new VilageForecastEntity();
          Object.assign(weatherData, data);
          results.push(weatherData);
        }
      }
      await queryRunner.manager.save(results);
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

  /*초단기예보 넣는 함수*/
  @Cron('0 50 0-23/5 * * *')
  async insertUltraSrtForecast() {
    this.logger.log('Start Insert UltraForecast!!');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const numOfRows = 60;
      const pageNo = 1;
      const currentDateTime = moment().tz('Asia/Seoul');
      const baseDate = currentDateTime.format('YYYYMMDD');
      const currentTime = currentDateTime.format('HH:mm');
      const currentHour = currentTime.slice(0, 2);

      const baseTime = `${currentHour}30`;

      const grids = AvailableGrids;

      const results: UltraSrtForecastEntity[] = [];

      while (grids.length !== 0) {
        const grid = grids.shift();
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${this.configService.get('WEATHER_KEY')}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        const res = await lastValueFrom(this.httpService.get(apiUrl));

        await this.delay(500);

        const datas = res.data.response?.body?.items?.item;
        if (!datas) {
          grids.push(grid);
          continue;
        }

        for (const item of datas.slice(1)) {
          if (!item.fcstDate || !item.fcstTime || !item.nx || !item.ny || !item.category || !item.fcstValue) {
            grids.push(grid);
            continue;
          }

          if (item.category === 'LGT') {
            const weatherData = new UltraSrtForecastEntity();
            Object.assign(weatherData, {
              fcstDate: item.fcstDate,
              fcstTime: item.fcstTime,
              nx: item.nx,
              ny: item.ny,
              LGT: item.fcstValue,
            });
            results.push(weatherData);
          }
        }
      }
      await queryRunner.manager.save(results);
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

  /* 최저&최고 기온 저장하는 함수*/
  @Cron('0 15 23 * * *')
  async insertDailyForecast() {
    this.logger.log('Start Insert DailyForecastInfo!!');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const numOfRows = 206;
      const pageNo = 1;
      const currentDateTime = moment().tz('Asia/Seoul');
      const baseDate = currentDateTime.format('YYYYMMDD');
      const currentTime = currentDateTime.format('HH:mm');
      const currentHour = currentTime.slice(0, 2);
      const baseTime = `${currentHour}00`;

      const grids = AvailableGrids;

      const results: DailyForecastEntity[] = [];

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

          if (item.category === 'TMN' || item.category === 'TMX') {
            const key = `${item.fcstDate}`;
            if (!acc[key]) {
              acc[key] = { fcstDate: item.fcstDate, nx: item.nx, ny: item.ny };
            }
            acc[key][item.category] = item.fcstValue;
          }
          return acc;
        }, {});

        const dataArray = Object.values(groupedData);

        for (const data of dataArray) {
          const weatherData = new DailyForecastEntity();
          Object.assign(weatherData, data);
          results.push(weatherData);
        }
      }
      await queryRunner.manager.save(results);
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
