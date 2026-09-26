import { createZodDto } from 'nestjs-zod';
import {
  connectionProbeSchema,
  createConnectionProbeSchema,
} from '@clothes-catalogue/dtos';

export class ConnectionProbeDto extends createZodDto(connectionProbeSchema) {}

export class CreateConnectionProbeDto extends createZodDto(
  createConnectionProbeSchema,
) {}
