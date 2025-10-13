import { Request, Response } from 'express';
import { ApiResponse } from '@investment-bot/shared';

export const telegramAuth = async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({
    success: false,
    error: 'Not implemented yet',
    message: 'Telegram authentication will be implemented soon',
  });
};

export const refreshToken = async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({
    success: false,
    error: 'Not implemented yet',
    message: 'Token refresh will be implemented soon',
  });
};

export const logout = async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({
    success: false,
    error: 'Not implemented yet',
    message: 'Logout will be implemented soon',
  });
};

export const verifyToken = async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({
    success: false,
    error: 'Not implemented yet',
    message: 'Token verification will be implemented soon',
  });
};