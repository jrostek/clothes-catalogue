import { createZodDto } from 'nestjs-zod';
import { healthSchema } from '@clothes-catalogue/dtos';

export class HealthDto extends createZodDto(healthSchema) {}
