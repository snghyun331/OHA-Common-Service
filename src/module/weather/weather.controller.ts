import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiResponseErrorNotFound,
  ApiResponseSuccess,
  ApiResponseWeatherSuccess,
  ApiTagWeather,
} from 'src/utils/decorators';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUserId } from 'src/utils/decorators/get-user.decorator';

@ApiTagWeather()
@Controller('api/common/weather')
export class WeathersController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiDescription('사용자가 디폴트로 설정한 지역의 기상청 날씨 조회')
  @ApiResponseWeatherSuccess()
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('디폴트로 설정한 지역이 없거나 디폴트 지역의 날씨 정보가 없음')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('datas')
  async getWeatherDatas(@GetUserId() userId: number): Promise<{ message: string; result: any }> {
    const result = await this.weatherService.getWeatherDatas(userId);
    return { message: '성공', result };
  }
}
