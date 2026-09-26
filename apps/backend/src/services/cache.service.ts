import { randomUUID } from 'node:crypto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { CacheHealthDto } from '@clothes-catalogue/dtos';
import { cacheStore } from '../cache';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  // Round-trips a probe key. cache-manager turns store errors into misses, so
  // a value that does not come back is the only reliable failure signal.
  async getHealth(): Promise<CacheHealthDto> {
    const key = `health:${randomUUID()}`;
    const value = randomUUID();

    const start = performance.now();
    await this.cache.set(key, value, 10_000);
    const readBack = await this.cache.get<string>(key);
    await this.cache.del(key);
    const latencyMs = Math.round(performance.now() - start);

    if (readBack !== value) {
      throw new Error('Probe value was not read back from the cache');
    }
    return { status: 'ok', store: cacheStore(), latencyMs };
  }
}
