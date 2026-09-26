import { ApiProperty } from '@nestjs/swagger';
import type * as shared from '@clothes-catalogue/dtos';

export class DatabaseHealthDto implements shared.DatabaseHealthDto {
  @ApiProperty({ enum: ['ok'] })
  status!: 'ok';

  @ApiProperty({ example: 3 })
  latencyMs!: number;

  @ApiProperty({ example: 'clothes-catalogue' })
  database!: string;

  @ApiProperty({ example: 'PostgreSQL 17.6 on x86_64-pc-linux-gnu' })
  serverVersion!: string;

  @ApiProperty({
    type: [String],
    example: ['20260924191158_add_connection_probe'],
  })
  appliedMigrations!: string[];
}
