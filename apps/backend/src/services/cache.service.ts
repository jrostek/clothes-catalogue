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
    await this.set(key, value, 10_000);
    const readBack = await this.tryGet<string>(key);
    await this.del(key);
    const latencyMs = Math.round(performance.now() - start);

    if (readBack !== value) {
      throw new Error('Probe value was not read back from the cache');
    }
    return { status: 'ok', store: cacheStore(), latencyMs };
  }

  // Values are stored as JSON, so every store (in-memory included) hands back
  // a fresh copy. Dates therefore come back as ISO strings.
  async tryGet<T>(key: string): Promise<T | undefined> {
    const entry = await this.read<T>(key);
    return entry.hit ? entry.value : undefined;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    const serializedValue = JSON.stringify(value);

    await this.cache.set(key, serializedValue, ttl);
  }

  // A cached null counts as a hit, so a factory that returns null runs once.
  async getOrSet<T>(
    key: string,
    valueFactory: () => T | Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const entry = await this.tryGet<T>(key);
    if (entry !== undefined) return entry;

    const value = await valueFactory();

    await this.set(key, value, ttl);

    return value;
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  // A missing key and a value that is not valid JSON both read as a miss.
  private async read<T>(
    key: string,
  ): Promise<{ hit: true; value: T } | { hit: false }> {
    const serializedValue = await this.cache.get<string>(key);
    if (serializedValue === undefined) return { hit: false };

    try {
      return { hit: true, value: JSON.parse(serializedValue) as T };
    } catch {
      return { hit: false };
    }
  }
}
