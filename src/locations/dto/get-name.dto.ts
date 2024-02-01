import { ApiProperty } from '@nestjs/swagger';

export class GetNameDto {
  @ApiProperty({ description: '(예): codes: ["123","234"]' })
  readonly codes: string[];
}
