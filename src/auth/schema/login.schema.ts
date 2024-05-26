import { z } from 'zod';

export const LoginSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
