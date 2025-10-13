import { Request, Response } from 'express';
import { ApiResponse } from '@investment-bot/shared';

export const notFound = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    message: `The requested resource ${req.originalUrl} was not found on this server.`,
  });
};