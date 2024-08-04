import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateFreqDistrictDto {
  @ApiProperty({ example: '1135072000' })
   code: string;

  @ApiHideProperty()
  @IsOptional()
   isDefault?: boolean;
}
