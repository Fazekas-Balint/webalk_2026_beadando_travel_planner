import prisma from '../../lib/prisma';
import { HttpError } from '../../middleware/error';
import { z } from 'zod';
import { updateDaySchema } from './days.schema';

type UpdateDayInput = z.infer<typeof updateDaySchema>;

async function verifyDayOwnership(userId: string, dayId: string) {
  const day = await prisma.day.findUnique({
    where: { id: dayId },
    include: {
      trip: true,
    },
  });

  if (!day || day.trip.userId !== userId) {
    throw new HttpError(404, 'Day not found');
  }

  return day;
}

export async function getDayById(userId: string, dayId: string) {
  await verifyDayOwnership(userId, dayId);

  return prisma.day.findUnique({
    where: { id: dayId },
    include: {
      activities: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function updateDay(userId: string, dayId: string, data: UpdateDayInput) {
  await verifyDayOwnership(userId, dayId);

  return prisma.day.update({
    where: { id: dayId },
    data,
  });
}