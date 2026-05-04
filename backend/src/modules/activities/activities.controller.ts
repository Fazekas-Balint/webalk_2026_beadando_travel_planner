import { Request, Response, NextFunction } from 'express';
import * as activitiesService from './activities.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub as string;
    const tripId = req.params.id as string;

    const activity = await activitiesService.createActivity(userId, tripId, req.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub as string;
    const activityId = req.params.id as string;

    const activity = await activitiesService.updateActivity(userId, activityId, req.body);
    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub as string;
    const activityId = req.params.id as string;

    await activitiesService.deleteActivity(userId, activityId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}