import { ApiProperty } from '@nestjs/swagger';
import { KmaType } from 'src/module/weather/enum/kma.enum';

export class WeatherDataDto {
  @ApiProperty({
    enum: ['KMA_CLOUDY', 'Moderator', 'User'],
  })
  widget: KmaType;

  @ApiProperty({
    description: 'Probability of precipitation in percentage',
    example: '30',
  })
  probPrecip: string;

  @ApiProperty({
    description: 'Indicates if the temperature difference is high',
    example: false,
  })
  isTempDiffHigh: boolean;

  @ApiProperty({
    description: 'Hourly temperature in degrees Celsius',
    example: '14',
  })
  hourlyTemp: string;
}

export class ApiResponseDto {
  @ApiProperty({
    description: 'HTTP status code of the response',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message indicating the success or failure of the request',
    example: '성공',
  })
  message: string;

  @ApiProperty({
    description: 'The data containing weather information',
    type: WeatherDataDto,
  })
  data: WeatherDataDto;
}
