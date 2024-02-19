import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiResponseErrorNotFound,
  ApiResponseSuccess,
  ApiTagWeather,
} from 'src/utils/decorators';
import { WeathersService } from './weather.service';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/utils/decorators/transaction.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUserId } from 'src/utils/decorators/get-user.decorator';
import { SchedulerRegistry } from '@nestjs/schedule';

@ApiTagWeather()
@Controller('api/common/weather')
export class WeathersController {
  constructor(
    private readonly weathersService: WeathersService,
    private scheduler: SchedulerRegistry,
  ) {}

  @ApiDescription(
    '사용자가 디폴트로 설정한 지역의 기상청 날씨 조회',
    '아직 배치 작업 전이라 날씨 데이터 조회가 안될 수도 있습니다',
  )
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('디폴트로 설정한 지역이 없거나 디폴트 지역의 날씨 정보가 없음')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('datas')
  async getWeatherDatas(@GetUserId() userId: number): Promise<{ message: string; result: any }> {
    const result = await this.weathersService.getWeatherDatas(userId);
    return { message: '성공', result };
  }

  @ApiDescription('기상청날씨를 DB에 Insert - Backend용')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Post('start-insert')
  async insertWeatherDatas(): Promise<{ message: string }> {
    const job = this.scheduler.getCronJob('InsertJob');
    job.start();

    return { message: 'Insert API가 성공적으로 호출되었습니다' };
  }

  // @Post('stop-insert')
  // async stopInsert() {
  //   const job = this.scheduler.getCronJob('test');
  //   job.stop();
  // }
}
