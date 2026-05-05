import { Request, Response, NextFunction } from 'express';
import * as tripsService from './trips.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripsService.createTrip(req.user!.sub, req.body);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const trips = await tripsService.getUserTrips(req.user!.sub);
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripsService.getTripById(req.user!.sub, req.params.id!);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await tripsService.deleteTrip(req.user!.sub, req.params.id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}