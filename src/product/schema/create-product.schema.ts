import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  creatorId: z.string().uuid(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
