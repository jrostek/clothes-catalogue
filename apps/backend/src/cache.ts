import { Logger } from '@nestjs/common';
import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

const logger = new Logger('Cache');

export const cacheStore = (): 'redis' | 'memory' =>
  process.env.REDIS_URL ? 'redis' : 'memory';

// Backs the Nest cache (CACHE_MANAGER) with the Redis instance the Aspire
// AppHost passes as REDIS_URL. Without it — e.g. a plain `nest:start:dev` —
// cache-manager falls back to an in-process in-memory store.
export function cacheModuleOptions(): CacheModuleOptions {
  const url = process.env.REDIS_URL;
  if (!url) {
    logger.warn('REDIS_URL is not set, caching in memory');
    return {};
  }

  // Fail commands fast while Redis is down (they become cache misses) instead
  // of queueing them until it reconnects, which would stall every request.
  const keyv = createKeyv({ url, disableOfflineQueue: true });
  // Keyv swallows store errors (cache misses instead of failures), so log them.
  keyv.on('error', (err: unknown) => logger.error(err, 'Redis cache error'));
  return { stores: [keyv] };
}
