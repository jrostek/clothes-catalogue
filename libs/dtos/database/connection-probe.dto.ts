import { z } from 'zod';

export const connectionProbeSchema = z.object({
  id: z.int().meta({ example: 1 }),
  message: z.string().meta({ example: 'hello from Swagger' }),
  createdAt: z.iso.datetime(),
});
export type ConnectionProbeDto = z.infer<typeof connectionProbeSchema>;

export const createConnectionProbeSchema = z.object({
  message: z.string().trim().min(1).meta({ example: 'hello from Swagger' }),
});
export type CreateConnectionProbeDto = z.infer<
  typeof createConnectionProbeSchema
>;
