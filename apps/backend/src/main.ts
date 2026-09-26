import './instrumentation';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SWAGGER_PATH } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  // Runs onModuleDestroy on SIGTERM/SIGINT, so PrismaService closes its pool.
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Clothes catalogue API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start the application', err);
  process.exit(1);
});
