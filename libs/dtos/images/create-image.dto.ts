import { z } from 'zod';

export const createImageSchema = z.object({
  name: z.string().trim().min(1).meta({ example: 'Blue denim jacket' }),
});
export type CreateImageDto = z.infer<typeof createImageSchema>;
