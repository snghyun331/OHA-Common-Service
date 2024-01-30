import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  ApiDescription,
  ApiParamDescription,
  ApiResponseErrorNotFound,
  ApiResponseSuccess,
  ApiTagLocation,
} from 'src/utils/decorators';

@ApiTagLocation()
@Controller('api/common/location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiDescription('법정동행정동코드로 행정구역 조회')
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('지원 혹은 존재하지 않는 코드')
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @Get('getDistrictName/:code')
  async getDistrictName(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getNameInfo(code);
    return { message: '행정구역명을 성공적으로 조회했습니다', result };
  }
}
