import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ImagesController } from './controllers/images.controller';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
