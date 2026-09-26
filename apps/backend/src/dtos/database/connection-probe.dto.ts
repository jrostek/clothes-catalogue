import { ApiProperty } from '@nestjs/swagger';
import type * as shared from '@clothes-catalogue/dtos';

export class ConnectionProbeDto implements shared.ConnectionProbeDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'hello from Swagger' })
  message!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class CreateConnectionProbeDto
  implements shared.CreateConnectionProbeDto
{
  @ApiProperty({ example: 'hello from Swagger', minLength: 1 })
  message!: string;
}
