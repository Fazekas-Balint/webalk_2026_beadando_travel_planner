import prisma from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../lib/password';
import { signAccessToken, signRefreshToken } from '../../lib/jwt';
import { HttpError } from '../../middleware/error';
import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.schema';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new HttpError(400, 'Email already in use');
  }

  const passwordHash = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
    },
  });

  const payload = { sub: user.id, email: user.email };
  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const payload = { sub: user.id, email: user.email };
  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}