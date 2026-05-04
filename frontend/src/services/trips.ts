import { api } from '../lib/api';
import type {
  Trip,
  CreateTripInput,
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from '../types';

export async function listTrips(): Promise<Trip[]> {
  const { data } = await api.get<Trip[]>('/trips');
  return data;
}

export async function getTrip(id: string): Promise<Trip> {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const { data } = await api.post<Trip>('/trips', input);
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  await api.delete(`/trips/${id}`);
}

export async function createActivity(tripId: string, input: CreateActivityInput): Promise<Activity> {
  const { data } = await api.post<Activity>(`/trips/${tripId}/activities`, input);
  return data;
}

export async function updateActivity(activityId: string, input: UpdateActivityInput): Promise<Activity> {
  const { data } = await api.patch<Activity>(`/activities/${activityId}`, input);
  return data;
}

export async function deleteActivity(activityId: string): Promise<void> {
  await api.delete(`/activities/${activityId}`);
}
