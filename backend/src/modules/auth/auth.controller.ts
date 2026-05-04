import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { env } from '../../config/env';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    domain: env.COOKIE_DOMAIN,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerUser(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.loginUser(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(200).json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: env.COOKIE_DOMAIN,
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    
    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const result = await authService.refreshAccessToken(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}