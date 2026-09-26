import { ApiProperty } from '@nestjs/swagger';
import type * as shared from '@clothes-catalogue/dtos';

export class CreateImageDto implements shared.CreateImageDto {
  @ApiProperty({ example: 'Blue denim jacket' })
  name!: string;
}
