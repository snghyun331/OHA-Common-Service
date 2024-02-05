import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  ApiResponseErrorBadRequest,
  ApiResponseErrorConflict,
  ApiResponseErrorNotFound,
  ApiResponseErrorServer,
  ApiResponseSuccess,
  ApiTagLocation,
} from 'src/utils/decorators';
import { GetCodeDto } from './dto/get-code.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetNameDto } from './dto/get-name.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/utils/decorators/transaction.decorator';
import { GetUserId } from 'src/utils/decorators/get-user.decorator';
import { CreateFreqDistrictDto } from './dto/create-freq-district.dto';
import { DeleteFreqDistrictDto } from './dto/delete-freq-district.dto';
import { UpdateDefaultDistrictDto } from './dto/update-default-district.dto';

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
    const { codes } = dto;
    const result = await this.locationsService.getNameByCodes(codes);
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
  @ApiBearerAuthAccessToken()
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @UseGuards(JwtAuthGuard)
  @Get('getgrid/:code')
  async getDistrictGridByCode(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getGridByCode(code);
    return { message: '성공', result };
  }

  @ApiDescription('자주 가는 지역 추가')
  @ApiBearerAuthAccessToken()
  @ApiResponseErrorConflict('해당 지역을 이미 선택')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('freqdistrict')
  async createFreqDistrict(
    @TransactionManager() transactionManager,
    @GetUserId() userId: number,
    @Body() dto: CreateFreqDistrictDto,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.createFreqDistrict(userId, dto, transactionManager);
    return { message: '자주 가는 지역 리스트에 성공적으로 추가하였습니다', result };
  }

  @ApiDescription('자주 가는 지역 모두 조회')
  @ApiBearerAuthAccessToken()
  @ApiResponseErrorNotFound('코드 조회 결과가 없음')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('freqdistrict')
  async getFreqDistricts(
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.getFreqDistricts(userId, transactionManager);
    return { message: '자주 가는 지역 정보를 성공적으로 불러왔습니다', result };
  }

  @ApiDescription('자주 가는 지역 삭제')
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorConflict('이미 지역 삭제')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('freqdistrict')
  async deleteFreqDistrict(
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @Body() dto: DeleteFreqDistrictDto,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationsService.deleteFreqDistrict(userId, dto, transactionManager);
    return { message: '성공적으로 지역이 삭제되었습니다', result };
  }

  @ApiDescription('디폴트 지역 변경')
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('디폴트 설정 및 해제가 실패')
  @ApiResponseErrorConflict('해당 지역은 이미 디폴트 되어있음')
  @ApiResponseErrorNotFound('디폴트로 설정하고자 하는 지역이 자주 가는 지역 목록에 있지 않음')
  @ApiResponseErrorServer('알 수 없는 오류,  데이터 정합성이 훼손되어 DB 수정 필요 - Default인 지역이 없음')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('default')
  async updateDefaultDistrict(
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @Body() dto: UpdateDefaultDistrictDto,
  ): Promise<{ message: string }> {
    await this.locationsService.updateDefaultDistrict(userId, dto, transactionManager);
    return { message: '성공적으로 디폴트 설정이 완료되었습니다' };
  }
}
