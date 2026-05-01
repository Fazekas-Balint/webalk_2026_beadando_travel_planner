import { z } from 'zod';

export const createActivitySchema = z.object({
  dayId: z.string().min(1),
  title: z.string().min(1).max(100),
  time: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  cost: z.number().nullable().optional(),
  order: z.number().int(),
});

export const updateActivitySchema = createActivitySchema.partial();