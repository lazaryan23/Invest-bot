import { Request, Response } from 'express';
import crypto from 'crypto';
import { ApiResponse } from '@investment-bot/shared';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

function verifyTelegramInitData(initData: string, botToken: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) return null;

  // Build data-check-string in lexicographic order excluding hash
  const entries: string[] = [];
  urlParams.forEach((value, key) => {
    if (key !== 'hash') entries.push(`${key}=${value}`);
  });
  entries.sort();
  const dataCheckString = entries.join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (hmac !== hash) return null;

  // Parse user json
  const userRaw = urlParams.get('user');
  const user = userRaw ? JSON.parse(userRaw) : undefined;
  return { user } as any;
}

export const telegramAuth = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!botToken) {
      return res.status(500).json({ success: false, error: 'Bot token not configured' } as any);
    }

    const headerInit = req.get('x-telegram-init-data') || req.get('X-Telegram-Init-Data');
    const bodyInit = (req.body?.telegramData as string) || '';
    const initData = headerInit || bodyInit;
    if (!initData) {
      return res.status(400).json({ success: false, error: 'Missing Telegram init data' } as any);
    }

    const parsed = verifyTelegramInitData(initData, botToken);
    if (!parsed?.user?.id) {
      return res.status(401).json({ success: false, error: 'Invalid Telegram data' } as any);
    }

    const tg = parsed.user;

    // Upsert user
    let user = await User.findOne({ telegramId: tg.id });
    if (!user) {
      user = await User.create({
        telegramId: tg.id,
        username: tg.username,
        firstName: tg.first_name || 'User',
        lastName: tg.last_name || '',
        email: undefined,
        // walletAddress and referralCode are auto-generated in pre-save
      } as any);
    } else {
      // Update basic fields
      user.username = tg.username || user.username;
      user.firstName = tg.first_name || user.firstName;
      user.lastName = tg.last_name || user.lastName;
      await user.save();
    }

    const accessToken = signAccessToken({ sub: user.id, tid: user.telegramId });
    const refreshToken = signRefreshToken({ sub: user.id, tid: user.telegramId });

    return res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60,
      },
    } as any);
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || 'Auth failed' } as any);
  }
};

export const refreshToken = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const token = req.body?.refreshToken as string;
    if (!token) return res.status(400).json({ success: false, error: 'Missing refresh token' } as any);
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken({ sub: payload.sub, tid: payload.tid });
    return res.status(200).json({ success: true, data: { accessToken } } as any);
  } catch (e: any) {
    return res.status(401).json({ success: false, error: 'Invalid refresh token' } as any);
  }
};

export const logout = async (req: Request, res: Response<ApiResponse>) => {
  return res.status(200).json({ success: true, data: { ok: true } } as any);
};

export const verifyToken = async (req: Request, res: Response<ApiResponse>) => {
  return res.status(200).json({ success: true, data: { ok: true } } as any);
};
