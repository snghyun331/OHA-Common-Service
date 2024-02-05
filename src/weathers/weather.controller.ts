import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiDescription, ApiTagWeather } from 'src/utils/decorators';
import { WeathersService } from './weather.service';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/utils/decorators/transaction.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetDataDto } from './dto/get-data.dto';

@ApiTagWeather()
@Controller('api/weather')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiDescription('기상청날씨를 DB에 Insert')
  @UseInterceptors(TransactionInterceptor)
  @Post('insert')
  async insertWeathers(@TransactionManager() transactionManager): Promise<{ message: string }> {
    await this.weathersService.insertWeather(transactionManager);
    return { message: '성공' };
  }

  @ApiDescription('격자로 날씨 정보 조회')
  @HttpCode(HttpStatus.OK)
  @Post('datas')
  async getWeatherDatas(@Body() dto: GetDataDto): Promise<{ message: string; result: any }> {
    const result = await this.weathersService.getDatas(dto);
    return { message: '성공', result };
  }
}
