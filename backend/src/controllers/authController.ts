import { Request, Response } from 'express';
import crypto from 'crypto';
import { ApiResponse } from '@investment-bot/shared';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

function verifyTelegramInitData(initData: string, botToken: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  console.log('[VERIFY] Hash from initData:', hash);
  if (!hash) return null;

  // Build data-check-string in lexicographic order excluding hash AND signature
  const entries: string[] = [];
  urlParams.forEach((value, key) => {
    if (key !== 'hash' && key !== 'signature') {
      entries.push(`${key}=${value}`);
    }
  });
  console.log('[VERIFY] Params for verification:', entries.length, 'entries');
  entries.forEach(e => console.log('[VERIFY] Param:', e.substring(0, 80)));
  entries.sort();
  const dataCheckString = entries.join('\n');
  console.log('[VERIFY] Data check string length:', dataCheckString.length);
  console.log('[VERIFY] Full data check string:', dataCheckString);

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  console.log('[VERIFY] Secret key generated from bot token');
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  console.log('[VERIFY] Computed HMAC:', hmac);
  console.log('[VERIFY] Expected hash:', hash);
  console.log('[VERIFY] Hashes match:', hmac === hash);
  
  if (hmac !== hash) return null;

  // Parse user json
  const userRaw = urlParams.get('user');
  const user = userRaw ? JSON.parse(userRaw) : undefined;
  return { user } as any;
}

export const telegramAuth = async (req: Request, res: Response<ApiResponse>) => {
  try {
    console.log('[AUTH] Telegram auth request started');
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    console.log('[AUTH] Bot token present:', !!botToken, 'length:', botToken.length);
    if (!botToken) {
      console.log('[AUTH] ERROR: Bot token not configured');
      return res.status(500).json({ success: false, error: 'Bot token not configured' } as any);
    }

    const headerInit = req.get('x-telegram-init-data') || req.get('X-Telegram-Init-Data');
    const bodyInit = (req.body?.telegramData as string) || '';
    const initData = headerInit || bodyInit;
    console.log('[AUTH] Init data source:', headerInit ? 'header' : bodyInit ? 'body' : 'none');
    console.log('[AUTH] Init data present:', !!initData, 'length:', initData?.length || 0);
    if (!initData) {
      console.log('[AUTH] ERROR: Missing init data');
      return res.status(400).json({ success: false, error: 'Missing Telegram init data' } as any);
    }

    console.log('[AUTH] Verifying init data...');
    const parsed = verifyTelegramInitData(initData, botToken);
    console.log('[AUTH] Verification result:', !!parsed, 'user id:', parsed?.user?.id);
    if (!parsed?.user?.id) {
      console.log('[AUTH] ERROR: Invalid Telegram data (verification failed)');
      return res.status(401).json({ success: false, error: 'Invalid Telegram data' } as any);
    }

    const tg = parsed.user;
    console.log('[AUTH] Telegram user:', tg.id, tg.username || tg.first_name);

    // Upsert user
    console.log('[AUTH] Looking up user with telegramId:', tg.id);
    let user = await User.findOne({ telegramId: tg.id });
    if (!user) {
      console.log('[AUTH] User not found, creating new user');
      user = await User.create({
        telegramId: tg.id,
        username: tg.username,
        firstName: tg.first_name || 'User',
        lastName: tg.last_name || '',
        email: undefined,
        // walletAddress and referralCode are auto-generated in pre-save
      } as any);
      console.log('[AUTH] User created:', user.id);
    } else {
      console.log('[AUTH] User found, updating');
      // Update basic fields
      user.username = tg.username || user.username;
      user.firstName = tg.first_name || user.firstName;
      user.lastName = tg.last_name || user.lastName;
      await user.save();
    }

    console.log('[AUTH] Generating tokens');
    const accessToken = signAccessToken({ sub: user.id, tid: user.telegramId });
    const refreshToken = signRefreshToken({ sub: user.id, tid: user.telegramId });

    console.log('[AUTH] Success! Returning user and tokens');
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
    console.log('[AUTH] ERROR caught:', e?.message || e);
    console.error('[AUTH] Stack:', e?.stack);
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
