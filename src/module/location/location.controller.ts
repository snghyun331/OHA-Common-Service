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
import { LocationService } from './location.service';
import {
  GetUserId,
  TransactionManager,
  ApiBearerAuthAccessToken,
  ApiCreatedResponseFreqDistrictSuccess,
  ApiDescription,
  ApiParamDescription,
  ApiResponseErrorBadRequest,
  ApiResponseErrorConflict,
  ApiResponseErrorNotFound,
  ApiResponseErrorServer,
  ApiResponseFreqDistrictDeleteSuccess,
  ApiResponseFreqDistrictSuccess,
  ApiResponseNearDistrictsSuccess,
  ApiResponseSameGridSuccess,
  ApiResponseSuccess,
  ApiTagLocation,
  ApiResponseAllDistrictSuccess,
} from 'src/common/decorator';
import { GetCodeDto } from './dto/get-code.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetNameDto } from './dto/get-name.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { CreateFreqDistrictDto } from './dto/create-freq-district.dto';
import { DeleteFreqDistrictDto } from './dto/delete-freq-district.dto';
import { UpdateDefaultDistrictDto } from './dto/update-default-district.dto';
import { CurrentCoordinateDto } from './dto/current-coordinate.dto';

@ApiTagLocation()
@Controller('api/common/location')
export class LocationsController {
  constructor(private readonly locationService: LocationService) {}

  @ApiDescription(' (법)행정동명으로 (법)행정코드 반환 - Backend용')
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('address가 요청되지 않음')
  @ApiResponseErrorNotFound('요청한 address와 일치하는 코드가 없음')
  @ApiBearerAuthAccessToken()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('getcode')
  async getDistrictCode(@Body() dto: GetCodeDto): Promise<{ message: string; result: any }> {
    const { address } = dto;
    const code = await this.locationService.getCodeByName(address);
    return { message: 'code를 성공적으로 가져왔습니다', result: code };
  }

  @ApiDescription('(법)행정동코드 리스트로 행정구역 조회 - Backend용')
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('codes가 요청되지 않음')
  @ApiResponseErrorNotFound('요청한 code와 일치하지 않는 (법)행정동명이 있음')
  @ApiBearerAuthAccessToken()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('getnamebycodes')
  async getDistrictNameByCodes(@Body() dto: GetNameDto): Promise<{ message: string; result: any }> {
    const { codes } = dto;
    const result = await this.locationService.getNameByCodes(codes);
    return { message: '행정구역명 리스트를 성공적으로 조회했습니다', result };
  }

  @ApiDescription('(법)행정동코드로 행정구역 조회 - Backend용')
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('지원 혹은 존재하지 않는 코드')
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('getnamebycode/:code')
  async getDistrictName(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getNameByCode(code);
    return { message: '행정구역명을 성공적으로 조회했습니다', result };
  }

  @ApiDescription('(법)행정동코드로 격자정보 조회 - Backend용')
  @ApiBearerAuthAccessToken()
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @UseGuards(JwtAuthGuard)
  @Get('getgrid/:code')
  async getDistrictGridByCode(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getGridByCode(code);
    return { message: '성공', result };
  }

  @ApiDescription('현재 주소와 동일한 격자를 갖는 지역들 조회 - Backend용', '코드와 행정구역명 모두 출력됩니다.')
  @ApiBearerAuthAccessToken()
  @ApiParamDescription('code', '숫자로 입력해주세요')
  @ApiResponseSameGridSuccess()
  @UseGuards(JwtAuthGuard)
  @Get('samegrid/:code')
  async getSameGridDistricts(@Param('code') code: string): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getSameGridDistricts(code);
    return { message: '성공적으로 불러왔습니다', result };
  }

  @ApiDescription('자주 가는 지역 추가', '요청 값: 법(행)정동 코드(code)')
  @ApiBearerAuthAccessToken()
  @ApiCreatedResponseFreqDistrictSuccess()
  @ApiResponseErrorBadRequest('요청한 지역 code가 비어있음, 4개까지만 추가할 수 있음')
  @ApiResponseErrorConflict('해당 지역을 이미 선택')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('freqdistrict')
  async createFreqDistrict(
    @TransactionManager() transactionManager,
    @GetUserId() userId: number,
    @Body() dto: CreateFreqDistrictDto,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationService.createFreqDistrict(userId, dto, transactionManager);
    return { message: '자주 가는 지역 리스트에 성공적으로 추가하였습니다', result };
  }

  @ApiDescription('자주 가는 지역 모두 조회')
  @ApiBearerAuthAccessToken()
  @ApiResponseFreqDistrictSuccess()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('freqdistrict')
  async getFreqDistricts(
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getFreqDistricts(userId, transactionManager);
    return { message: '자주 가는 지역 정보를 성공적으로 불러왔습니다', result };
  }

  @ApiDescription('자주 가는 지역 삭제', '요청 값: 법(행)정동 코드(code)')
  @ApiBearerAuthAccessToken()
  @ApiResponseFreqDistrictDeleteSuccess()
  @ApiResponseErrorBadRequest('요청한 지역 code가 비어있음')
  @ApiResponseErrorConflict('이미 지역 삭제')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('freqdistrict')
  async deleteFreqDistrict(
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @Body() dto: DeleteFreqDistrictDto,
  ): Promise<{ message: string; result: any }> {
    const result = await this.locationService.deleteFreqDistrict(userId, dto, transactionManager);
    return { message: '성공적으로 지역이 삭제되었습니다', result };
  }

  @ApiDescription('디폴트 지역 변경', '요청 값: 법(행)정동 코드(code)')
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorBadRequest('요청한 지역 code가 없거나, 디폴트 설정 및 해제가 실패')
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
    await this.locationService.updateDefaultDistrict(userId, dto, transactionManager);
    return { message: '성공적으로 디폴트 설정이 완료되었습니다' };
  }

  @ApiDescription('사용자가 디폴트로 설정한 지역 조회')
  @ApiBearerAuthAccessToken()
  @ApiResponseSuccess()
  @ApiResponseErrorNotFound('default 지역이 없음')
  @UseGuards(JwtAuthGuard)
  @Get('default')
  async getDefaultDistrict(@GetUserId() userId: number): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getDefaultDistrict(userId);
    return { message: '성공적으로 디폴트 지역을 가져왔습니다', result };
  }

  @ApiDescription(
    '사용자 근처 지역 리스트 조회',
    '현재 위치와 가장 가까운 지역부터 정렬하였으며 최대 30개 지역까지 출력됩니다.',
  )
  @ApiBearerAuthAccessToken()
  @ApiResponseNearDistrictsSuccess()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('neardistricts')
  async getNearDistricts(@Body() dto: CurrentCoordinateDto): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getNearDistricts(dto);
    return { message: '성공적으로 근처 지역 30곳을 불러왔습니다', result };
  }

  @ApiDescription('모든 행정구역명 조회')
  @ApiBearerAuthAccessToken()
  @ApiResponseAllDistrictSuccess()
  @UseGuards(JwtAuthGuard)
  @Get('alldistricts')
  async getAllDistrictsName(): Promise<{ message: string; result: any }> {
    const result = await this.locationService.getAllDistrictsName();
    return { message: '성공적으로 모든 행정구역명을 불러왔습니다', result };
  }
}
