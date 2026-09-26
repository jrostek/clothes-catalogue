import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import {
  ConnectionProbeDto,
  CreateConnectionProbeDto,
} from '../dtos/database/connection-probe.dto';
import { DatabaseHealthDto } from '../dtos/database/database-health.dto';
import { DatabaseService } from '../services/database.service';

// Test endpoints for checking the database connection end to end.
@Controller('database')
export class DatabaseController {
  private readonly logger = new Logger(DatabaseController.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Get('health')
  @ApiOkResponse({ type: DatabaseHealthDto })
  @ApiServiceUnavailableResponse({ description: 'Database unreachable' })
  async getHealth(): Promise<DatabaseHealthDto> {
    try {
      return await this.databaseService.getHealth();
    } catch (err) {
      this.logger.error(err, 'Database health check failed');
      throw new ServiceUnavailableException(
        `Database unreachable: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  @Get('probes')
  @ApiOkResponse({ type: [ConnectionProbeDto] })
  listProbes(): Promise<ConnectionProbeDto[]> {
    return this.databaseService.listProbes();
  }

  @Post('probes')
  @ApiCreatedResponse({ type: ConnectionProbeDto })
  @ApiBadRequestResponse({ description: 'message is missing or empty' })
  createProbe(
    @Body() body: CreateConnectionProbeDto,
  ): Promise<ConnectionProbeDto> {
    if (typeof body?.message !== 'string' || body.message.trim() === '') {
      throw new BadRequestException('message must be a non-empty string');
    }
    return this.databaseService.createProbe(body.message);
  }
}
