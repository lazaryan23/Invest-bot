import { Router, Request, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const data = {
    stats: {
      totalBalance: 0,
      totalInvested: 0,
      totalProfit: 0,
      activeInvestments: 0,
      referralEarnings: 0,
      portfolioGrowth: 0,
    },
    recentActivities: [] as any[],
    portfolioChart: {
      labels: [],
      values: [],
    },
  };

  return res.status(200).json({ success: true, data });
});

// GET /api/dashboard/recent-activities
router.get('/recent-activities', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const data: any[] = [];
  return res.status(200).json({ success: true, data });
});

export default router;