import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../services/app.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = moduleRef.get(AppController);
  });

  describe('getHello', () => {
    it('returns "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
