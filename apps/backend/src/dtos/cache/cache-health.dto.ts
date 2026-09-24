import { createZodDto } from 'nestjs-zod';
import { cacheHealthSchema } from '@clothes-catalogue/dtos';

export class CacheHealthDto extends createZodDto(cacheHealthSchema) {}
