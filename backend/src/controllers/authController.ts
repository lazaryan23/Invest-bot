import { Request, Response } from 'express';
import crypto from 'crypto';
import { ApiResponse } from '@investment-bot/shared';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

/**
 * Verifies the Telegram Mini App initData string.
 * This implementation uses manual string parsing and decoding to ensure the
 * dataCheckString is constructed precisely as required by Telegram's validation algorithm,
 * which avoids common errors related to URLSearchParams's handling of complex fields (like 'user').
 * @param initData The raw initData string from the Telegram Mini App.
 * @param botToken The bot's token.
 * @returns An object containing the parsed user data or null if verification fails.
 */
function verifyTelegramInitData(initData: string, botToken: string) {
  // Use manual split and decode for maximum control over the exact string required for HMAC.
  const pairs = initData.split('&');
  const safeEntries: { key: string; value: string }[] = [];
  let finalHash: string | undefined = undefined;
  let userRaw: string | undefined;

  for (const pair of pairs) {
    // Split key=value, handling the possibility that the value itself contains '=' (though rare in initData)
    const [key, value] = pair.split('=', 2);

    // We must decode the value because the verification check string uses the decoded value.
    const decodedValue = decodeURIComponent(value);

    if (key === 'hash') {
      finalHash = decodedValue;
    } else if (key !== 'signature') {
      // Collect all other decoded key/value pairs
      safeEntries.push({ key, value: decodedValue });
      if (key === 'user') {
        userRaw = decodedValue;
      }
    }
  }

  if (!finalHash) return null;

  // 1. Sort entries lexicographically by key
  console.log('[VERIFY] Params for verification:', safeEntries.length, 'entries');
  safeEntries.forEach(e => console.log('[VERIFY] Param:', `${e.key}=${e.value}`.substring(0, 80)));
  safeEntries.sort((a, b) => a.key.localeCompare(b.key));

  // 2. Join them with '\n'
  const dataCheckString = safeEntries
      .map(entry => `${entry.key}=${entry.value}`)
      .join('\n');

  console.log('[VERIFY] Data check string length:', dataCheckString.length);
  console.log('[VERIFY] Full data check string:', dataCheckString);

  // 3. Compute HMAC
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  console.log('[VERIFY] Secret key generated using WebAppData');
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  console.log('[VERIFY] Computed HMAC:', hmac);
  console.log('[VERIFY] Expected hash:', finalHash);

  const hashesMatch = hmac === finalHash;
  console.log('[VERIFY] Hashes match:', hashesMatch);

  if (!hashesMatch) return null;

  // Parse user json
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
