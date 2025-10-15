import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  telegramId?: number;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' } as any);
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.telegramId = payload.tid;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' } as any);
  }
}