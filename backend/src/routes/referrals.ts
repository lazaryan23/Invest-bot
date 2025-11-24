import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Referral } from '../models/Referral';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const BOT_USERNAME = process.env.BOT_USERNAME || 'Invest_smartBot';

// GET /api/referrals/stats - get user's referral stats
router.get('/stats', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
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
router.get('/code', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
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

// GET /api/referrals/users - get referred users list
router.get('/users', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const referrals = await Referral.find({ referrerId: userId, isActive: true }).populate('referredUserId');
    
    const data = referrals.map(ref => ({
      id: (ref.referredUserId as any)._id,
      username: (ref.referredUserId as any).username || 'Unknown',
      firstName: (ref.referredUserId as any).firstName || '',
      registeredAt: ref.createdAt.toISOString(),
      level: 1,
      totalInvested: (ref.referredUserId as any).totalInvested || 0,
      yourEarnings: ref.bonusAmount || 0,
      isActive: (ref.referredUserId as any).isActive || false,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[REFERRED USERS ERROR]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch referred users' });
  }
});

// POST /api/referrals/generate - regenerate referral code
router.post('/generate', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Return existing code (in future, you could add logic to regenerate)
    const data = { code: user.referralCode };
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[GENERATE REFERRAL CODE ERROR]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate referral code' });
  }
});

export default router;
