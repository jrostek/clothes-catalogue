import { Injectable } from '@nestjs/common';
import type {
  ConnectionProbeDto,
  DatabaseHealthDto,
} from '@clothes-catalogue/dtos';
import type { ConnectionProbe } from '../generated/prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<DatabaseHealthDto> {
    const start = performance.now();
    const [server] = await this.prisma.$queryRaw<
      { database: string; version: string }[]
    >`SELECT current_database() AS database, version() AS version`;
    const latencyMs = Math.round(performance.now() - start);

    const migrations = await this.prisma.$queryRaw<
      { migration_name: string }[]
    >`
      SELECT migration_name FROM _prisma_migrations
      WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
      ORDER BY finished_at`;

    return {
      status: 'ok',
      latencyMs,
      database: server.database,
      serverVersion: server.version,
      appliedMigrations: migrations.map((m) => m.migration_name),
    };
  }

  async listProbes(): Promise<ConnectionProbeDto[]> {
    const probes = await this.prisma.connectionProbe.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return probes.map(toDto);
  }

  async createProbe(message: string): Promise<ConnectionProbeDto> {
    return toDto(
      await this.prisma.connectionProbe.create({ data: { message } }),
    );
  }
}

function toDto(probe: ConnectionProbe): ConnectionProbeDto {
  return { ...probe, createdAt: probe.createdAt.toISOString() };
}
