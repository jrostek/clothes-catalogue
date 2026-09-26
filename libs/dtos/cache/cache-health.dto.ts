import { z } from 'zod';

export const cacheHealthSchema = z.object({
  status: z.literal('ok'),
  store: z.enum(['redis', 'memory']).meta({ example: 'redis' }),
  latencyMs: z.number().meta({ example: 1 }),
});
export type CacheHealthDto = z.infer<typeof cacheHealthSchema>;
