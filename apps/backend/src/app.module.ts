import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PrismaService } from './services/prisma.service';
import { ImagesController } from './controllers/images.controller';
import { DatabaseController } from './controllers/database.controller';
import { DatabaseService } from './services/database.service';
import { isSwaggerRequest } from './swagger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { autoLogging: { ignore: (req) => isSwaggerRequest(req.url) } },
    }),
  ],
  controllers: [AppController, ImagesController, DatabaseController],
  providers: [AppService, PrismaService, DatabaseService],
})
export class AppModule {}
