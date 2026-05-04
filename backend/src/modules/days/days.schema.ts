import { z } from 'zod';

export const updateDaySchema = z.object({
  order: z.number().int().optional(),
});