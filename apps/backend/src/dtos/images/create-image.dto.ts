import { createZodDto } from 'nestjs-zod';
import { createImageSchema } from '@clothes-catalogue/dtos';

export class CreateImageDto extends createZodDto(createImageSchema) {}
