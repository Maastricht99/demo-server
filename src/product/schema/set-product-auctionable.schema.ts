import { z } from "zod";

export const SetProductAuctionableSchema = z.object({
    deadline: z.date()
});

export type SetProductAuctionableDto = z.infer<typeof SetProductAuctionableSchema>;