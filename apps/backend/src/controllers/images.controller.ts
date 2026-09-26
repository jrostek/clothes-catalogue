import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { CreateImageDto } from '../dtos/images/create-image.dto';

@Controller('images')
export class ImagesController {
  @Post()
  create(@Body() _body: CreateImageDto): never {
    throw new NotImplementedException('Image upload is not implemented yet');
  }
}
