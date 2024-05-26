import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, LessThan } from 'typeorm';
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

      const grids = [...AvailableGrids];

      const results: VilageForecastEntity[] = [];

      while (grids.length !== 0) {
        const grid = grids.shift();
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${this.configService.get('WEATHER_KEY')}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        const res = await this.makeRequestWithRetry(apiUrl, 3); // 3번까지 재시도

        await this.delay(1000);

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

      const chunkSize = 1000;
      for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);
        await queryRunner.manager.save(chunk);
      }
      await queryRunner.commitTransaction();
      this.logger.log(`VilageForecast insertJob Finished!! at ${moment().tz('Asia/Seoul')}`);
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
      const currentMinute = currentTime.slice(3);

      let baseTime;
      if (currentMinute >= '50') {
        baseTime = `${currentHour}30`;
      } else {
        if (currentHour === '00') {
          baseTime = '2330';
        } else {
          const previousHour = (parseInt(currentHour, 10) - 1).toString().padStart(2, '0');
          baseTime = `${previousHour}30`;
        }
      }

      const grids = [...AvailableGrids];

      const results: UltraSrtForecastEntity[] = [];

      while (grids.length !== 0) {
        const grid = grids.shift();
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${this.configService.get('WEATHER_KEY')}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        const res = await this.makeRequestWithRetry(apiUrl, 3); // 3번까지 재시도

        await this.delay(1000);

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
      this.logger.log(`UltraForecast insertJob Finished!! at ${moment().tz('Asia/Seoul')}`);
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
      const numOfRows = 302;
      const pageNo = 1;
      const currentDateTime = moment().tz('Asia/Seoul');
      const baseDate = currentDateTime.format('YYYYMMDD');

      const currentTime = currentDateTime.format('HH:mm');
      const currentHour = currentTime.slice(0, 2);
      const baseTime = `${currentHour}00`;

      const grids = [...AvailableGrids];

      const results: DailyForecastEntity[] = [];

      while (grids.length !== 0) {
        const grid = grids.shift();
        const nx = grid.nx;
        const ny = grid.ny;
        const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${this.configService.get('WEATHER_KEY')}&numOfRows=${numOfRows}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        const res = await this.makeRequestWithRetry(apiUrl, 3); // 3번까지 재시도

        await this.delay(1000);

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
      this.logger.log(`DailyForecast insertJob Finished!! at ${moment().tz('Asia/Seoul')}`);
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(e);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteWeatherData() {
    this.logger.log('Start delete WeatherDatas!!');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentDateTime = moment().tz('Asia/Seoul');
      const currentDate = currentDateTime.format('YYYYMMDD');

      await Promise.all([
        queryRunner.manager.delete(VilageForecastEntity, { fcstDate: LessThan(currentDate) }),
        queryRunner.manager.delete(DailyForecastEntity, { fcstDate: LessThan(currentDate) }),
        queryRunner.manager.delete(UltraSrtForecastEntity, { fcstDate: LessThan(currentDate) }),
      ]);

      await queryRunner.commitTransaction();
      this.logger.log(`DeleteJob Finished!! at ${moment().tz('Asia/Seoul')}`);
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

  private async makeRequestWithRetry(url: string, retries: number): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        return await lastValueFrom(this.httpService.get(url));
      } catch (error) {
        if (error.code === 'ECONNRESET' && i < retries - 1) {
          this.logger.warn(`Retrying request... Attempt ${i + 1} of ${retries}`);
          await this.delay(2000); // 1초 대기 후 재시도
        } else {
          throw error;
        }
      }
    }
  }
}
