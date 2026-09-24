import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import type { CreateImageDto } from '@clothes-catalogue/dtos';

@Controller('images')
export class ImagesController {
  @Post()
  create(@Body() _body: CreateImageDto): never {
    throw new NotImplementedException('Image upload is not implemented yet');
  }
}
