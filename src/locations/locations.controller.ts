import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  ApiResponseErrorBadRequest,
  ApiResponseErrorNotFound,
  ApiResponseSuccess,
  ApiTagLocation,
} from 'src/utils/decorators';
import { GetCodeDto } from './dto/get-code.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetNameDto } from './dto/get-name.dto';

@ApiTagLocation()
@Controller('api/common/location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiDescription(' (법)행정동명으로 (법)행정코드 반환')
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('address가 요청되지 않음')
  @ApiResponseErrorNotFound('요청한 address와 일치하는 코드가 없음')
  @ApiBearerAuthAccessToken()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('getcode')
  async getDistrictCode(@Body() dto: GetCodeDto): Promise<{ message: string; result: any }> {
    const code = await this.locationsService.getCodeByName(dto);
    return { message: 'code를 성공적으로 가져왔습니다', result: code };
  }

  @ApiDescription('(법)행정동코드 리스트로 행정구역 조회')
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('codes가 요청되지 않음')
  @ApiResponseErrorNotFound('요청한 code와 일치하지 않는 (법)행정동명이 있음')
  @ApiBearerAuthAccessToken()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('getnamebycodes')
  async getDistrictNameByCodes(@Body() dto: GetNameDto): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getNameByCodes(dto);
    return { message: '행정구역명 리스트를 성공적으로 조회했습니다', result };
  }

  @ApiDescription('(법)행정동코드로 행정구역 조회')
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('지원 혹은 존재하지 않는 코드')
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('getnamebycode/:code')
  async getDistrictName(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getNameByCode(code);
    return { message: '행정구역명을 성공적으로 조회했습니다', result };
  }

  @ApiDescription('(법)행정동코드로 격자정보 조회')
  @Get('getgrid/:code')
  async getDistrictGridByCode(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getGridByCode(code);
    return { message: '성공', result };
  }
}
