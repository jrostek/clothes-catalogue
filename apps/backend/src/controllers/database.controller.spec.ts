import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';

describe('DatabaseController', () => {
  let databaseController: DatabaseController;
  const databaseService = {
    getHealth: jest.fn(),
    listProbes: jest.fn(),
    createProbe: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseController],
      providers: [{ provide: DatabaseService, useValue: databaseService }],
    }).compile();

    databaseController = moduleRef.get(DatabaseController);
  });

  describe('getHealth', () => {
    it('returns 503 when the database is unreachable', async () => {
      databaseService.getHealth.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(databaseController.getHealth()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });

  describe('createProbe', () => {
    it('rejects an empty message', () => {
      expect(() => databaseController.createProbe({ message: ' ' })).toThrow(
        BadRequestException,
      );
    });

    it('creates a probe with the given message', async () => {
      databaseService.createProbe.mockResolvedValue({ id: 1 });

      await databaseController.createProbe({ message: 'hello' });

      expect(databaseService.createProbe).toHaveBeenCalledWith('hello');
    });
  });
});
