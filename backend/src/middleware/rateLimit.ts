import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const isTest = env.NODE_ENV === 'test';

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: isTest ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 1000 : 5,
  message: { error: 'Too many attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});