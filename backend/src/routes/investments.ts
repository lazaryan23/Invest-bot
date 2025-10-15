import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/investments/plans - return demo plans
router.get('/plans', (req: Request, res: Response) => {
  const data = [
    {
      id: 'plan_basic',
      name: 'Basic Plan',
      description: 'Starter plan suitable for new users',
      minAmount: 10,
      maxAmount: 1000,
      duration: 30,
      profitPercentage: 8,
      totalReturn: 8,
      riskLevel: 'low',
      isActive: true,
      features: ['Low risk', 'Daily accruals'],
    },
    {
      id: 'plan_pro',
      name: 'Pro Plan',
      description: 'Balanced plan with better returns',
      minAmount: 100,
      maxAmount: 5000,
      duration: 90,
      profitPercentage: 30,
      totalReturn: 30,
      riskLevel: 'medium',
      isActive: true,
      features: ['Balanced risk', 'Weekly accruals'],
    },
    {
      id: 'plan_elite',
      name: 'Elite Plan',
      description: 'High-return plan for experienced users',
      minAmount: 500,
      maxAmount: 20000,
      duration: 180,
      profitPercentage: 75,
      totalReturn: 75,
      riskLevel: 'high',
      isActive: true,
      features: ['High risk', 'Monthly accruals'],
    },
  ];

  return res.status(200).json({ success: true, data });
});

// GET /api/investments/history - return empty list for now
router.get('/history', (req: Request, res: Response) => {
  const data: any[] = [];
  return res.status(200).json({ success: true, data });
});

export default router;
