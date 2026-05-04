import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(1).max(100),
  destination: z.string().min(1).max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isPublic: z.boolean().optional().default(false),
  coverImage: z.string().url().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'endDate must be on or after startDate',
  path: ['endDate'],
});