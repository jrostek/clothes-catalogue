import { z } from 'zod';

export const dependencyHealthSchema = z.object({
  status: z.enum(['ok', 'error']),
  latencyMs: z.number().meta({ example: 4 }),
  error: z.string().optional().meta({ example: 'connect ECONNREFUSED' }),
});
export type DependencyHealthDto = z.infer<typeof dependencyHealthSchema>;

export const healthSchema = z.object({
  status: z.enum(['ok', 'error']),
  checks: z.object({
    database: dependencyHealthSchema,
    cache: dependencyHealthSchema,
  }),
});
export type HealthDto = z.infer<typeof healthSchema>;
