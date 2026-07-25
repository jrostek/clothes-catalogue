import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ImagesController } from './controllers/images.controller';

@Module({
  imports: [],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
