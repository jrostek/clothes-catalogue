export type DatabaseHealthDto = {
  status: 'ok';
  latencyMs: number;
  database: string;
  serverVersion: string;
  appliedMigrations: string[];
};
