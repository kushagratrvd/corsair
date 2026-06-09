import { generateOAuthUrl } from 'corsair/oauth';
import type { Request, Response } from 'express';
import { corsair } from '../server/corsair';

const REDIRECT_URI = `${process.env.APP_URL}/api/auth`;

// Replace with Redis or DB-backed store in production
export const pendingStates = new Set<string>();

export async function connectHandler(req: Request, res: Response) {
    const tenantId = "user_abc123";; // from your session middleware
    if (!tenantId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const plugin = req.query.plugin as string | undefined;
    if (!plugin) {
        res.status(400).json({ error: 'Missing plugin param' });
        return;
    }

    const { url, state } = await generateOAuthUrl(corsair, plugin, {
        tenantId,
        redirectUri: REDIRECT_URI,
    });

    pendingStates.add(state);
    res.cookie('oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000, // 10 minutes in ms
    });
    res.redirect(url);
}