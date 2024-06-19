import { ApiProperty } from '@nestjs/swagger';

export class GetNameDto {
  @ApiProperty({ example: ['1135059500', '1138063100'] })
  readonly codes: string[];
}
