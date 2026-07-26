import { Body, Controller, Post } from '@nestjs/common';
import type { CreateImageDto } from '@clothes-catalogue/dtos';

@Controller('images')
export class ImagesController {
  @Post()
  async create(@Body() body: CreateImageDto) {}
}
