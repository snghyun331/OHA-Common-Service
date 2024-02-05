import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetDataDto {
  @ApiProperty()
  @IsNumber()
  readonly nx: number;

  @ApiProperty()
  @IsNumber()
  readonly ny: number;
}
