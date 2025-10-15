import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string; // user id
  tid?: number; // telegram id
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export function signAccessToken(payload: JwtPayload) {
  return (jwt.sign as any)(payload, JWT_SECRET as any, { expiresIn: ACCESS_EXPIRES as any });
}

export function signRefreshToken(payload: JwtPayload) {
  return (jwt.sign as any)(payload, REFRESH_SECRET as any, { expiresIn: REFRESH_EXPIRES as any });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}