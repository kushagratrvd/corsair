import { processOAuthCallback } from 'corsair/oauth';
import type { Request, Response } from 'express';
import { corsair } from '../server/corsair';
import { pendingStates } from './connect';

const REDIRECT_URI = `${process.env.APP_URL}/api/auth`;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

export async function authCallbackHandler(req: Request, res: Response) {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    const error = req.query.error as string | undefined;

    res.clearCookie('oauth_state'); // always clear — success or failure

    if (error) {
        res.status(400).send(
            `<html><body><h2>Authorization failed</h2><p>${escapeHtml(error)}</p></body></html>`,
        );
        return;
    }

    if (!code || !state) {
        res.status(400).send('<p>Missing code or state parameter.</p>');
        return;
    }

    if (!pendingStates.has(state)) {
        res.status(400).send('<p>Invalid state. Possible CSRF attempt.</p>');
        return;
    }
    pendingStates.delete(state);

    try {
        const result = await processOAuthCallback(corsair, {
            code,
            state,
            redirectUri: REDIRECT_URI,
        });

        res.send(
            `<html><body><h2>Connected!</h2>` +
            `<p>Plugin <strong>${escapeHtml(result.plugin)}</strong> ` +
            `authorized for tenant <strong>${escapeHtml(result.tenantId)}</strong>.</p>` +
            `<p><a href="/">Back to home</a></p></body></html>`,
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).send(
            `<html><body><h2>OAuth error</h2><p>${escapeHtml(message)}</p></body></html>`,
        );
    }
}