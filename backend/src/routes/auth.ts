import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validation';
import * as authController from '../controllers/authController';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Protected profile endpoint
router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' } as any);
  return res.status(200).json({ success: true, data: user.toJSON() } as any);
});

// Telegram authentication (also accepts header X-Telegram-Init-Data)
router.post(
  '/telegram',
  // body validators are optional now because we may use header; keep non-strict
  [body('telegramData').optional()],
  validateRequest,
  asyncHandler(authController.telegramAuth)
);

// Refresh token
router.post('/refresh', asyncHandler(authController.refreshToken));

// Logout
router.post('/logout', asyncHandler(authController.logout));

// Verify token
router.get('/verify', asyncHandler(authController.verifyToken));

export default router;
