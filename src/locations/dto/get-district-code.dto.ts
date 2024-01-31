import { ApiProperty } from '@nestjs/swagger';

export class GetDistrictCodeDto {
  @ApiProperty({ description: '(예) 경기도 고양시 덕양구 화정2동' })
  readonly address: string;
}
