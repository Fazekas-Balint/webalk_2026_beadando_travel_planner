import prisma from '../../lib/prisma';
import { HttpError } from '../../middleware/error';
import { z } from 'zod';
import { createTripSchema } from './trips.schema';

type CreateTripInput = z.infer<typeof createTripSchema>;

export async function createTrip(userId: string, data: CreateTripInput) {
  const days = [];
  let currentDate = new Date(data.startDate);
  const end = new Date(data.endDate);
  let order = 0;

  while (currentDate <= end) {
    days.push({
      date: new Date(currentDate),
      order: order,
    });
    currentDate.setDate(currentDate.getDate() + 1);
    order++;
  }

  const trip = await prisma.trip.create({
    data: {
      userId,
      title: data.title,
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      isPublic: data.isPublic,
      coverImage: data.coverImage,
      days: {
        create: days,
      },
    },
    include: {
      days: true,
    },
  });

  return trip;
}

export async function getUserTrips(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: 'asc' },
  });
}

export async function getTripById(userId: string, tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      days: {
        orderBy: { order: 'asc' },
        include: {
          activities: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!trip || trip.userId !== userId) {
    throw new HttpError(404, 'Trip not found');
  }

  return trip;
}

export async function deleteTrip(userId: string, tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  
  if (!trip || trip.userId !== userId) {
    throw new HttpError(404, 'Trip not found');
  }

  await prisma.trip.delete({ where: { id: tripId } });
}