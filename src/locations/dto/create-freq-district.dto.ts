import { ApiProperty } from '@nestjs/swagger';

export class CreateFreqDistrictDto {
  @ApiProperty({ example: '서울특별시 노원구 상계1동' })
  readonly address: string;
}
