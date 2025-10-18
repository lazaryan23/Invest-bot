import { Request, Response } from 'express';
import crypto from 'crypto';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
} from '../utils/jwt';
import { User } from '../models/User';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export const telegramAuth = async (req: Request, res: Response) => {
    try {
        const headerInit = req.get('x-telegram-init-data') || req.get('X-Telegram-Init-Data');
        const bodyInit = (req.body?.telegramData as string) || '';
        const initData = headerInit || bodyInit;

        if (!initData) {
            return res.status(400).json({ success: false, error: 'Missing Telegram init data' });
        }

        // Parse and verify init data
        const pairs = initData.split('&');
        const safeEntries: { key: string; value: string }[] = [];
        let finalHash: string | undefined;
        let userRaw: string | undefined;

        for (const pair of pairs) {
            const [key, value] = pair.split('=', 2);
            const decodedValue = decodeURIComponent(value);
            if (key === 'hash') {
                finalHash = decodedValue;
            } else {
                safeEntries.push({ key, value: decodedValue });
                if (key === 'user') userRaw = decodedValue;
            }
        }

        if (!finalHash) {
            return res.status(400).json({ success: false, error: 'Invalid init data (no hash)' });
        }

        safeEntries.sort((a, b) => a.key.localeCompare(b.key));
        const dataCheckString = safeEntries.map(e => `${e.key}=${e.value}`).join('\n');

        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest();
        const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (hmac !== finalHash) {
            return res.status(401).json({ success: false, error: 'Invalid Telegram data (hash mismatch)' });
        }

        const tgUser = userRaw ? JSON.parse(userRaw) : undefined;
        if (!tgUser?.id) {
            return res.status(400).json({ success: false, error: 'Invalid Telegram user data' });
        }

        // Create or update user
        let user = await User.findOne({ telegramId: tgUser.id });
        if (!user) {
            user = await User.create({
                telegramId: tgUser.id,
                username: tgUser.username,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name,
            });
        }

        // Tokens
        const accessToken = signAccessToken({ sub: user.id, tid: user.telegramId });
        const refreshToken = signRefreshToken({ sub: user.id, tid: user.telegramId });

        return res.status(200).json({
            success: true,
            data: {
                user: user.toJSON(),
                accessToken,
                refreshToken,
            },
        });
    } catch (e: any) {
        console.error('[AUTH ERROR]', e);
        return res.status(500).json({ success: false, error: e.message || 'Auth failed' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.body?.refreshToken as string;
        if (!token)
            return res.status(400).json({ success: false, error: 'Missing refresh token' });

        const payload = verifyRefreshToken(token);
        const accessToken = signAccessToken(payload);

        return res.status(200).json({ success: true, data: { accessToken } });
    } catch {
        return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
};

export const logout = async (_req: Request, res: Response) => {
    return res.status(200).json({ success: true, data: { ok: true } });
};

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, error: 'Missing token' });

        const payload = verifyAccessToken(token);
        return res.status(200).json({ success: true, data: payload });
    } catch {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};
