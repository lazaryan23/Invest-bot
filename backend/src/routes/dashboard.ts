import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', (req: Request, res: Response) => {
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
router.get('/recent-activities', (req: Request, res: Response) => {
  const data: any[] = [];
  return res.status(200).json({ success: true, data });
});

export default router;