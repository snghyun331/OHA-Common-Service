import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
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

@ApiTagWeather()
@Controller('api/common/weather')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @ApiDescription('사용자가 디폴트로 설정한 지역의 기상청 날씨 조회')
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
}
