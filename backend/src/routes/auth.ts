import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validation';
import * as authController from '../controllers/authController';

const router = Router();

// Simple demo profile endpoint to unblock frontend
router.get('/profile', (req: Request, res: Response) => {
  const data = {
    id: 'demo-user',
    email: 'demo@example.com',
    username: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: true,
    isPhoneVerified: false,
  };
  return res.status(200).json({ success: true, data });
});

// Telegram authentication
router.post(
  '/telegram',
  [
    body('telegramData').notEmpty().withMessage('Telegram data is required'),
    body('hash').notEmpty().withMessage('Hash is required'),
  ],
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
