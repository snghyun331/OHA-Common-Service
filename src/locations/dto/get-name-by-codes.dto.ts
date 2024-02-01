import { ApiProperty } from '@nestjs/swagger';

export class GetNameByCodesDto {
  @ApiProperty({ description: '(예): codes: ["123","234]' })
  readonly codes: string[];
}
