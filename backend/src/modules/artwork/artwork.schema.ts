import { z } from 'zod';

export const createArtworkSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  price: z.coerce.number().positive(),
  currency: z.string().default('USD'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  medium: z.string().optional(),
  dimensions: z.object({
    width: z.coerce.number().positive(),
    height: z.coerce.number().positive(),
    unit: z.string().default('px'),
  }).optional(),
  sellingType: z.enum(['fixed', 'auction']).default('fixed'),
  auctionDuration: z.coerce.number().positive().optional(), // Duration in hours
});

export const placeBidSchema = z.object({
  amount: z.number().positive(),
});

export const updateArtworkSchema = createArtworkSchema.partial();
