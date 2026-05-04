import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import pino from 'pino';

import { env } from './config/env';
import { globalLimiter, authLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';

import authRoutes from './modules/auth/auth.routes';
import tripsRoutes from './modules/trips/trips.routes';
import daysRoutes from './modules/days/days.routes';
import activitiesRoutes from './modules/activities/activities.routes';

const app = express();
const logger = pino();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(globalLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/days', daysRoutes);
app.use('/api/activities', activitiesRoutes);

app.use(errorHandler);

export { app };