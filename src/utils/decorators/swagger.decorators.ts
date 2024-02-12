import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

export const ApiTagLocation = () => ApiTags('LOCATION');

export const ApiTagWeather = () => ApiTags('WEATHER');

export const ApiDescription = (summary: string, description?: string) => ApiOperation({ summary, description });

export const ApiBearerAuthAccessToken = () => ApiBearerAuth('access-token');

export const ApiConsumesMultiForm = () => ApiConsumes('multipart/form-data');

export const ApiBodyImageForm = (fieldname: string) =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fieldname]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  });

export const ApiParamDescription = (name: string, des: string) => ApiParam({ name: name, description: des });

export const ApiResponseSuccess = () => ApiResponse({ status: 200, description: 'OK' });

export const ApiResponseErrorBadRequest = (des: string) => ApiResponse({ status: 400, description: des });

export const ApiResponseErrorUnauthorized = (des: string) => ApiResponse({ status: 401, description: des });

export const ApiResponseErrorNotFound = (des: string) => ApiResponse({ status: 404, description: des });

export const ApiResponseErrorConflict = (des: string) => ApiResponse({ status: 409, description: des });

export const ApiResponseErrorServer = (des: string) => ApiResponse({ status: 500, description: des });

export const ApiResponseNearDistrictsSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        statusCode: 200,
        message: '성공적으로 근처 지역 리스트를 불러왔습니다',
        data: [
          '경기도 고양시 덕양구 화정2동',
          '경기도 고양시 덕양구 행신3동',
          '경기도 고양시 덕양구 능곡동',
          '경기도 고양시 덕양구 토당동',
          '경기도 고양시 덕양구 내곡동',
          '경기도 고양시 덕양구 대장동',
          '경기도 고양시 덕양구 신평동',
          '경기도 고양시 덕양구 행신1동',
          '경기도 고양시 덕양구 행신동',
          '경기도 고양시 덕양구 화정1동',
          '경기도 고양시 덕양구 화정동',
          '경기도 고양시 덕양구 흥도동',
          '경기도 고양시 덕양구 원흥동',
          '경기도 고양시 덕양구 도내동',
          '경기도 고양시 덕양구 행주동',
          '경기도 고양시 덕양구 행주내동',
          '경기도 고양시 덕양구 행주외동',
          '경기도 고양시 덕양구 행신2동',
          '경기도 고양시 덕양구 강매동',
          '경기도 고양시 덕양구 성사2동',
          '경기도 고양시 일산동구 백석2동',
          '경기도 고양시 덕양구 성사1동',
          '경기도 고양시 일산동구 백석1동',
          '경기도 고양시 일산동구 백석동',
          '경기도 고양시 덕양구 창릉동',
          '경기도 고양시 덕양구 동산동',
          '경기도 고양시 덕양구 용두동',
          '경기도 고양시 일산동구 장항1동',
          '경기도 고양시 일산동구 장항동',
          '경기도 고양시 덕양구 주교동',
        ],
      },
    },
  });

export const ApiResponseSameGridSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        statusCode: 200,
        message: '성공적으로 불러왔습니다',
        data: [
          {
            code: '4215034000',
            firstAddress: '강원도',
            secondAddress: '강릉시',
            thirdAddress: '강동면',
            isHcode: true,
            isBcode: false,
          },
          {
            code: '4215034021',
            firstAddress: '강원도',
            secondAddress: '강릉시',
            thirdAddress: '상시동리',
            isHcode: false,
            isBcode: true,
          },
          {
            code: '4215034022',
            firstAddress: '강원도',
            secondAddress: '강릉시',
            thirdAddress: '모전리',
            isHcode: false,
            isBcode: true,
          },
        ],
      },
    },
  });
