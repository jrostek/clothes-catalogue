import { Injectable } from '@nestjs/common';
import type { DependencyHealthDto, HealthDto } from '@clothes-catalogue/dtos';
import { CacheService } from './cache.service';
import { DatabaseService } from './database.service';

// A check that has not answered by then counts as failed, so a hanging
// dependency cannot stall the health endpoint past the poller's own timeout.
export const CHECK_TIMEOUT_MS = 3_000;

@Injectable()
export class HealthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async check(): Promise<HealthDto> {
    const [database, cache] = await Promise.all([
      probe(() => this.databaseService.getHealth()),
      probe(() => this.cacheService.getHealth()),
    ]);
    const healthy = database.status === 'ok' && cache.status === 'ok';
    return { status: healthy ? 'ok' : 'error', checks: { database, cache } };
  }
}

async function probe(
  check: () => Promise<unknown>,
): Promise<DependencyHealthDto> {
  const start = performance.now();
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      check(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Timed out after ${CHECK_TIMEOUT_MS} ms`)),
          CHECK_TIMEOUT_MS,
        );
      }),
    ]);
    return { status: 'ok', latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Math.round(performance.now() - start),
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}
