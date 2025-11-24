import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Referral } from '../models/Referral';

const router = Router();

const BOT_USERNAME = process.env.BOT_USERNAME || 'Invest_smartBot';

// GET /api/referrals/stats - get user's referral stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get referral stats
    const referrals = await Referral.find({ referrerId: userId, isActive: true }).populate('referredUserId');
    const totalReferrals = referrals.length;
    const totalEarnings = user.referralEarnings || 0;

    // Get current month earnings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyReferrals = await Referral.find({
      referrerId: userId,
      isActive: true,
      createdAt: { $gte: startOfMonth }
    });
    const currentMonthEarnings = monthlyReferrals.reduce((sum, ref) => sum + (ref.bonusAmount || 0), 0);

    const data = {
      stats: {
        totalReferrals,
        activeReferrals: totalReferrals,
        totalEarnings,
        currentMonthEarnings,
        conversionRate: 0,
        availableBalance: user.availableBalance || 0,
      },
      referralCode: {
        code: user.referralCode,
        url: `https://t.me/${BOT_USERNAME}?start=${user.referralCode}`,
        clicks: 0,
        registrations: totalReferrals,
        createdAt: user.createdAt.toISOString(),
        isActive: true,
      },
      referredUsers: referrals.map(ref => ({
        id: (ref.referredUserId as any)._id,
        username: (ref.referredUserId as any).username,
        firstName: (ref.referredUserId as any).firstName,
        joinedAt: ref.createdAt,
        bonusEarned: ref.bonusAmount,
      })),
      earningsHistory: [],
    };

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[REFERRAL STATS ERROR]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch referral stats' });
  }
});

// GET /api/referrals/code - return user's referral code
router.get('/code', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const referrals = await Referral.find({ referrerId: userId, isActive: true });

    const data = {
      code: user.referralCode,
      url: `https://t.me/${BOT_USERNAME}?start=${user.referralCode}`,
      clicks: 0,
      registrations: referrals.length,
      createdAt: user.createdAt.toISOString(),
      isActive: true,
    };
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[REFERRAL CODE ERROR]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch referral code' });
  }
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
