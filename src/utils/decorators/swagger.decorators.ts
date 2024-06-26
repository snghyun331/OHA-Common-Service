import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';

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
        message: '성공적으로 근처 지역 30곳을 불러왔습니다',
        data: [
          {
            code: '4128162200',
            address: '경기도 고양시 덕양구 화정2동',
          },
          {
            code: '4128165500',
            address: '경기도 고양시 덕양구 행신3동',
          },
          {
            code: '4128161000',
            address: '경기도 고양시 덕양구 능곡동',
          },
          {
            code: '4128112000',
            address: '경기도 고양시 덕양구 토당동',
          },
          {
            code: '4128112100',
            address: '경기도 고양시 덕양구 내곡동',
          },
          {
            code: '4128112200',
            address: '경기도 고양시 덕양구 대장동',
          },
          {
            code: '4128112700',
            address: '경기도 고양시 덕양구 신평동',
          },
          {
            code: '4128164000',
            address: '경기도 고양시 덕양구 행신1동',
          },
        ],
      },
    },
  });

export const ApiResponseSameGridSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    content: {
      'application/json': {
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
    },
  });

export const ApiResponseFreqDistrictSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    content: {
      'application/json': {
        examples: {
          예시1: {
            description: '자주 가는 지역 리스트 있음',
            value: {
              statusCode: 200,
              message: '자주 가는 지역 정보를 성공적으로 불러왔습니다',
              data: [
                {
                  code: '1135063000',
                  firstAddress: '서울특별시',
                  secondAddress: '노원구',
                  thirdAddress: '상계1동',
                  isHcode: true,
                  isBcode: false,
                  isDefault: true,
                },
              ],
            },
          },
          예시2: {
            description: '자주 가는 지역 리스트 없음',
            value: {
              statusCode: 200,
              message: '자주 가는 지역 정보를 성공적으로 불러왔습니다',
              data: [],
            },
          },
        },
      },
    },
  });

export const ApiCreatedResponseFreqDistrictSuccess = () =>
  ApiCreatedResponse({
    status: 201,
    description: 'CREATED',
    content: {
      'application/json': {
        example: {
          statusCode: 201,
          message: '자주 가는 지역 리스트에 성공적으로 추가하였습니다',
          data: [
            {
              code: '1135063000',
              firstAddress: '서울특별시',
              secondAddress: '노원구',
              thirdAddress: '상계1동',
              isHcode: true,
              isBcode: false,
              isDefault: true,
            },
          ],
        },
      },
    },
  });

export const ApiResponseFreqDistrictDeleteSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '성공적으로 지역이 삭제되었습니다',
          data: [
            {
              code: '1135072000',
              firstAddress: '서울특별시',
              secondAddress: '노원구',
              thirdAddress: '상계10동',
              isHcode: true,
              isBcode: false,
              isDefault: true,
            },
          ],
        },
      },
    },
  });

export const ApiResponseAllDistrictSuccess = () =>
  ApiResponse({
    status: 200,
    description: 'OK',
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '성공적으로 모든 행정구역명을 불러왔습니다',
          data: {
            서울특별시: {
              종로구: [
                {
                  address: '청운효자동',
                  code: '1111051500',
                },
                {
                  address: '종로1.2.3.4가동',
                  code: '1111061500',
                },
                {
                  address: '종로5.6가동',
                  code: '1111063000',
                },
                {
                  address: '창신1동',
                  code: '1111067000',
                },
                {
                  address: '창신2동',
                  code: '1111068000',
                },
                {
                  address: '창신3동',
                  code: '1111069000',
                },
                {
                  address: '숭인1동',
                  code: '1111070000',
                },
                {
                  address: '숭인2동',
                  code: '1111071000',
                },
              ],
              중구: [
                {
                  address: '회현동',
                  code: '1114054000',
                },
                {
                  address: '명동',
                  code: '1114055000',
                },
                {
                  address: '필동',
                  code: '1114057000',
                },
                {
                  address: '장충동',
                  code: '1114058000',
                },
                {
                  address: '광희동',
                  code: '1114059000',
                },
                {
                  address: '을지로동',
                  code: '1114060500',
                },
                {
                  address: '다산동',
                  code: '1114062500',
                },
              ],
            },
          },
        },
      },
    },
  });

export const ApiResponseWeatherSuccess = () =>
  ApiResponse({
    status: 200,
    // type: ApiResponseDto,
    description: `widget: {
      KMA_CLOUDY: 흐림, 
      KMA_MOSTLY_CLOUDY: 구름 많음, 
      KMA_CLEAR: 맑음,
      KMA_WINDY: 바람,
      KMA_RAIN: 비,
      KMA_SNOW: 눈,
      KMA_THUNDER_RAIN: 천둥비,
      KMA_HOT: 고온,
      KMA_COLD: 저온,
      KMA_RAIN_SNOW: 비+눈
    }, probPrecip: 강수확률, isTempDiffHigh: 일교차 10도 이상인가(맞음: true, 아님: false), hourlyTemp: 1시간 기온`,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '성공',
          data: {
            widget: 'KMA_CLOUDY',
            probPrecip: '30',
            isTempDiffHigh: false,
            hourlyTemp: '14',
          },
        },
      },
    },
  });
