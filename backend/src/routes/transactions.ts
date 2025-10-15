import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/transactions - demo empty list with pagination shape expected by frontend
router.get('/', (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const data = {
    transactions: [],
    total: 0,
    page,
    limit,
    hasMore: false,
  };
  return res.status(200).json({ success: true, data });
});

export default router;
