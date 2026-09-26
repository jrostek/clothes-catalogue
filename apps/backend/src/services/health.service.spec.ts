import { Test } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { DatabaseService } from './database.service';
import { CHECK_TIMEOUT_MS, HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;
  const databaseService = { getHealth: jest.fn() };
  const cacheService = { getHealth: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    databaseService.getHealth.mockResolvedValue({ status: 'ok' });
    cacheService.getHealth.mockResolvedValue({ status: 'ok' });

    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: DatabaseService, useValue: databaseService },
        { provide: CacheService, useValue: cacheService },
      ],
    }).compile();

    healthService = moduleRef.get(HealthService);
  });

  it('is healthy when every dependency is', async () => {
    const health = await healthService.check();

    expect(health.status).toBe('ok');
  });

  it('reports the failing dependency and its error', async () => {
    cacheService.getHealth.mockRejectedValue(new Error('ECONNREFUSED'));

    const health = await healthService.check();

    expect(health).toMatchObject({
      status: 'error',
      checks: {
        database: { status: 'ok' },
        cache: { status: 'error', error: 'ECONNREFUSED' },
      },
    });
  });

  it('fails a dependency that does not answer in time', async () => {
    jest.useFakeTimers();
    databaseService.getHealth.mockReturnValue(new Promise(() => {}));

    const result = healthService.check();
    await jest.advanceTimersByTimeAsync(CHECK_TIMEOUT_MS);

    expect((await result).checks.database).toMatchObject({
      status: 'error',
      error: `Timed out after ${CHECK_TIMEOUT_MS} ms`,
    });
    jest.useRealTimers();
  });
});
