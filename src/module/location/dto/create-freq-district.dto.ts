import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateFreqDistrictDto {
  @ApiProperty({ example: '1135072000' })
  readonly code: string;

  @ApiHideProperty()
  @IsOptional()
  readonly isDefault?: boolean;
}
