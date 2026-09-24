import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { CacheHealthDto } from '../dtos/cache/cache-health.dto';
import { CacheService } from '../services/cache.service';

// Test endpoint for checking the cache connection end to end.
@Controller('cache')
export class CacheController {
  private readonly logger = new Logger(CacheController.name);

  constructor(private readonly cacheService: CacheService) {}

  @Get('health')
  @ApiOkResponse({ type: CacheHealthDto })
  @ApiServiceUnavailableResponse({ description: 'Cache unreachable' })
  async getHealth(): Promise<CacheHealthDto> {
    try {
      return await this.cacheService.getHealth();
    } catch (err) {
      this.logger.error(err, 'Cache health check failed');
      throw new ServiceUnavailableException(
        `Cache unreachable: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
