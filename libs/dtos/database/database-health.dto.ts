import { z } from 'zod';

export const databaseHealthSchema = z.object({
  status: z.literal('ok'),
  latencyMs: z.number().meta({ example: 3 }),
  database: z.string().meta({ example: 'clothes-catalogue' }),
  serverVersion: z
    .string()
    .meta({ example: 'PostgreSQL 17.6 on x86_64-pc-linux-gnu' }),
  appliedMigrations: z
    .array(z.string())
    .meta({ example: ['20260924191158_add_connection_probe'] }),
});
export type DatabaseHealthDto = z.infer<typeof databaseHealthSchema>;
