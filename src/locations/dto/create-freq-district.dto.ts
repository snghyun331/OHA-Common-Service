import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateFreqDistrictDto {
  @ApiProperty({ example: '서울특별시 노원구 상계1동' })
  readonly address: string;

  @ApiHideProperty()
  @IsOptional()
  readonly isDefault?: boolean;
}
