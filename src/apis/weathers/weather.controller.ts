import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiResponseErrorNotFound,
  ApiResponseSuccess,
  ApiTagWeather,
} from 'src/utils/decorators';
import { WeathersService } from './weather.service';
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

  @ApiDescription('배치 작업 가동 API - Backend용')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Post('start-batch')
  async startInsert(): Promise<{ message: string }> {
    const job = this.scheduler.getCronJob('InsertJob');
    job.start();
    console.log('InsertJob Batch Api Started!');
    return { message: 'Insert API가 성공적으로 호출되었습니다' };
  }

  @ApiDescription('배치 작업 종료 API - Backend용')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Post('terminate-batch')
  async stopInsert(): Promise<{ message: string }> {
    const job = this.scheduler.getCronJob('InsertJob');
    job.stop();
    console.log('InsertJob Batch Api Terminated!');
    return { message: 'Terminate API가 성공적으로 호출되었습니다' };
  }
}
