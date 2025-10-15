import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/wallet/balance - demo wallet data
router.get('/balance', (req: Request, res: Response) => {
  const data = {
    balance: {
      available: 0,
      locked: 0,
      total: 0,
      currency: 'USDT',
    },
    address: {
      address: 'TR3WrAeQAyCk8zrhPNkSHEG48XAz6vMJXY',
      network: 'TRC20',
      currency: 'USDT',
    },
    transactions: [],
    pendingTransactions: 0,
  };
  return res.status(200).json({ success: true, data });
});

// GET /api/wallet/transactions - demo empty list
router.get('/transactions', (req: Request, res: Response) => {
  const data: any[] = [];
  return res.status(200).json({ success: true, data });
});

// GET /api/wallet/address - return deposit address only
router.get('/address', (req: Request, res: Response) => {
  const data = {
    address: 'TR3WrAeQAyCk8zrhPNkSHEG48XAz6vMJXY',
    network: 'TRC20',
    currency: 'USDT',
  };
  return res.status(200).json({ success: true, data });
});

// POST /api/wallet/deposit - accept deposit request (stub)
router.post('/deposit', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: { status: 'received' } });
});

// POST /api/wallet/withdraw - accept withdrawal request (stub)
router.post('/withdraw', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: { status: 'queued' } });
});

export default router;
