import { CACHE_MANAGER, Cache, CacheModule } from '@nestjs/cache-manager';
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

  describe('tryGet', () => {
    it('returns a value stored with set', async () => {
      const cacheService = moduleRef.get(CacheService);
      await cacheService.set('key', { id: 1, name: 'shirt' });

      expect(await cacheService.tryGet('key')).toEqual({
        id: 1,
        name: 'shirt',
      });
    });

    it('returns undefined for a missing key', async () => {
      expect(
        await moduleRef.get(CacheService).tryGet('missing'),
      ).toBeUndefined();
    });

    it('returns undefined for a value that is not JSON', async () => {
      await moduleRef.get<Cache>(CACHE_MANAGER).set('key', 'not json');

      expect(await moduleRef.get(CacheService).tryGet('key')).toBeUndefined();
    });
  });

  describe('getOrSet', () => {
    it('awaits an async factory and caches its result', async () => {
      const cacheService = moduleRef.get(CacheService);
      const factory = jest.fn().mockResolvedValue({ id: 1 });

      expect(await cacheService.getOrSet('key', factory)).toEqual({ id: 1 });
      expect(await cacheService.getOrSet('key', factory)).toEqual({ id: 1 });
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('caches a null result instead of recomputing it', async () => {
      const cacheService = moduleRef.get(CacheService);
      const factory = jest.fn().mockReturnValue(null);

      await cacheService.getOrSet('key', factory);
      expect(await cacheService.getOrSet('key', factory)).toBeNull();
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
