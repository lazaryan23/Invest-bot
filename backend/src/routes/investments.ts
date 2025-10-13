import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    error: 'Not implemented yet',
    message: 'Investment endpoints will be implemented soon',
  });
});

export default router;
