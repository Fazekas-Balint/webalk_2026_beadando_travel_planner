import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino();

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  return res.status(500).json({ error: 'Internal server error' });
}