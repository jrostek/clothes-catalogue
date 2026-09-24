import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [CacheService],
    }).compile();
  });

  describe('getHealth', () => {
    it('round-trips a value through the in-memory store', async () => {
      const health = await moduleRef.get(CacheService).getHealth();

      expect(health).toMatchObject({ status: 'ok', store: 'memory' });
    });

    it('fails when the value does not come back', async () => {
      jest
        .spyOn(moduleRef.get(CACHE_MANAGER), 'get')
        .mockResolvedValue(undefined);

      await expect(moduleRef.get(CacheService).getHealth()).rejects.toThrow(
        'Probe value was not read back from the cache',
      );
    });
  });
});
