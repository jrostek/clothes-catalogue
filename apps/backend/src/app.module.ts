import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
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
  providers: [
    // Validates @Body(), @Query() and @Param() against their createZodDto schemas.
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    AppService,
    PrismaService,
    DatabaseService,
  ],
})
export class AppModule {}
