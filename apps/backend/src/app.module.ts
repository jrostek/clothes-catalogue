import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ImagesController } from './controllers/images.controller';
import { isSwaggerRequest } from './swagger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { autoLogging: { ignore: (req) => isSwaggerRequest(req.url) } },
    }),
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
