import { ApiProperty } from '@nestjs/swagger';

export class UpdateDefaultDistrictDto {
  @ApiProperty({ example: '1135072000' })
  readonly code: string;
}
