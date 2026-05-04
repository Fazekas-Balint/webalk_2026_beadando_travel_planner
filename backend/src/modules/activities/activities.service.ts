import prisma from '../../lib/prisma';
import { HttpError } from '../../middleware/error';
import { z } from 'zod';
import { createActivitySchema, updateActivitySchema } from './activities.schema';

type CreateActivityInput = z.infer<typeof createActivitySchema>;
type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

async function verifyActivityOwnership(userId: string, activityId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      day: {
        include: {
          trip: true,
        },
      },
    },
  });

  if (!activity || activity.day.trip.userId !== userId) {
    throw new HttpError(404, 'Not found');
  }

  return activity;
}

export async function createActivity(userId: string, tripId: string, data: CreateActivityInput) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) {
    throw new HttpError(404, 'Not found');
  }

  const day = await prisma.day.findFirst({
    where: { id: data.dayId, tripId: tripId },
  });

  if (!day) {
    throw new HttpError(400, 'Invalid day for this trip');
  }

  return prisma.activity.create({
    data: {
      dayId: data.dayId,
      title: data.title,
      time: data.time,
      lat: data.lat,
      lng: data.lng,
      address: data.address,
      notes: data.notes,
      cost: data.cost,
      order: data.order,
    },
  });
}

export async function updateActivity(userId: string, activityId: string, data: UpdateActivityInput) {
  await verifyActivityOwnership(userId, activityId);

  return prisma.activity.update({
    where: { id: activityId },
    data,
  });
}

export async function deleteActivity(userId: string, activityId: string) {
  await verifyActivityOwnership(userId, activityId);

  await prisma.activity.delete({
    where: { id: activityId },
  });
}