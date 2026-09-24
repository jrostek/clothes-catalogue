import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { HealthDto } from '../dtos/health/health.dto';
import { HEALTH_PATH } from '../health';
import { HealthService } from '../services/health.service';

// Aggregate health of the backend and its dependencies; the Aspire AppHost
// uses it as the backend resource's health check.
@Controller(HEALTH_PATH)
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: HealthDto })
  @ApiServiceUnavailableResponse({
    type: HealthDto,
    description: 'At least one dependency is unhealthy',
  })
  async getHealth(): Promise<HealthDto> {
    const health = await this.healthService.check();
    if (health.status !== 'ok') {
      this.logger.warn(health.checks, 'Health check failed');
      throw new ServiceUnavailableException(health);
    }
    return health;
  }
}
