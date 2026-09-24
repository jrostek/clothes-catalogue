import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PrismaService } from './services/prisma.service';
import { ImagesController } from './controllers/images.controller';
import { DatabaseController } from './controllers/database.controller';
import { DatabaseService } from './services/database.service';
import { CacheController } from './controllers/cache.controller';
import { CacheService } from './services/cache.service';
import { cacheModuleOptions } from './cache';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { isHealthRequest } from './health';
import { isSwaggerRequest } from './swagger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: {
          ignore: (req) =>
            isSwaggerRequest(req.url) || isHealthRequest(req.url),
        },
      },
    }),
    // Global, so any provider can inject CACHE_MANAGER.
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: cacheModuleOptions,
    }),
  ],
  controllers: [
    AppController,
    ImagesController,
    DatabaseController,
    CacheController,
    HealthController,
  ],
  providers: [
    // Validates @Body(), @Query() and @Param() against their createZodDto schemas.
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    AppService,
    PrismaService,
    DatabaseService,
    CacheService,
    HealthService,
  ],
})
export class AppModule {}
