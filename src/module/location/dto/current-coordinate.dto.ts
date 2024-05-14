import { ApiProperty } from '@nestjs/swagger';

export class CurrentCoordinateDto {
  @ApiProperty()
  readonly longitude: number;

  @ApiProperty()
  readonly latitude: number;
}
