import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validation';
import * as authController from '../controllers/authController';

const router = Router();

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