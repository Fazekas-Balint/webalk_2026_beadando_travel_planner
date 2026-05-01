import { Request, Response, NextFunction } from 'express';
import * as daysService from './days.service';

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub as string;
    const dayId = req.params.id as string;

    const day = await daysService.getDayById(userId, dayId);
    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub as string;
    const dayId = req.params.id as string;

    const day = await daysService.updateDay(userId, dayId, req.body);
    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
}