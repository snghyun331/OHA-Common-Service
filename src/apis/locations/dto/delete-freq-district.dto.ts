import { ApiProperty } from '@nestjs/swagger';

export class DeleteFreqDistrictDto {
  @ApiProperty({ example: '1135072000' })
  readonly code: string;
}
