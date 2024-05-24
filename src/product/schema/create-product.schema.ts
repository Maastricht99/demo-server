import { z } from "zod";

export const CreateProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    pictureUrl: z.string(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;