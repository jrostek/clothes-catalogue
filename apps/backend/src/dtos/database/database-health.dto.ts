import { createZodDto } from 'nestjs-zod';
import { databaseHealthSchema } from '@clothes-catalogue/dtos';

export class DatabaseHealthDto extends createZodDto(databaseHealthSchema) {}
