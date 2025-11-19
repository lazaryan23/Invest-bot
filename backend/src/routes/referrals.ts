import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/referrals/stats - demo stats shape expected by frontend
router.get('/stats', (req: Request, res: Response) => {
  const data = {
    stats: {
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
      currentMonthEarnings: 0,
      conversionRate: 0,
      availableBalance: 0,
    },
    referralCode: {
      code: 'INVEST-000',
      url: 'https://t.me/Invest_smartBot?start=INVEST-000',
      clicks: 0,
      registrations: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    referredUsers: [],
    earningsHistory: [],
  };

  return res.status(200).json({ success: true, data });
});

// GET /api/referrals/code - return referral code only
router.get('/code', (req: Request, res: Response) => {
  const data = {
    code: 'INVEST-000',
    url: 'https://t.me/Invest_smartBot?start=INVEST-000',
    clicks: 0,
    registrations: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  return res.status(200).json({ success: true, data });
});

// GET /api/referrals/users - empty referred users list
router.get('/users', (req: Request, res: Response) => {
  const data: any[] = [];
  return res.status(200).json({ success: true, data });
});

// POST /api/referrals/generate - create new code (stub)
router.post('/generate', (req: Request, res: Response) => {
  const data = { code: 'INVEST-NEW' };
  return res.status(200).json({ success: true, data });
});

export default router;
