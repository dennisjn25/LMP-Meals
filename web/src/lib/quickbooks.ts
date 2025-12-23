
import OAuthClient from 'intuit-oauth';
import { db } from './db';

const clientId = process.env.QB_CLIENT_ID;
const clientSecret = process.env.QB_CLIENT_SECRET;
const redirectUri = process.env.QB_REDIRECT_URI;
const environment = (process.env.QB_ENV as 'sandbox' | 'production') || 'sandbox';

if (!clientId || !clientSecret || !redirectUri) {
    console.warn("⚠️ QuickBooks environment variables are missing! Check QB_CLIENT_ID, QB_CLIENT_SECRET, and QB_REDIRECT_URI.");
}

export const oauthClient = new OAuthClient({
    clientId: clientId || 'MISSING_CLIENT_ID',
    clientSecret: clientSecret || 'MISSING_CLIENT_SECRET',
    environment: environment,
    redirectUri: redirectUri || 'MISSING_REDIRECT_URI',
});

export async function getQuickBooksConfig() {
    return await db.quickBooksConfig.findFirst({
        where: { env: environment }
    });
}

export async function updateQuickBooksConfig(data: {
    realmId?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    refreshExpiresAt?: Date;
}) {
    const config = await getQuickBooksConfig();

    if (config) {
        return await db.quickBooksConfig.update({
            where: { id: config.id },
            data
        });
    } else {
        return await db.quickBooksConfig.create({
            data: {
                ...data,
                env: environment
            }
        });
    }
}

export async function getValidToken() {
    const config = await getQuickBooksConfig();
    if (!config || !config.accessToken || !config.refreshToken) {
        return null;
    }

    // Check if token is expired (with 1 minute buffer)
    const isExpired = config.tokenExpiresAt ? new Date().getTime() > (config.tokenExpiresAt.getTime() - 60000) : true;

    if (isExpired) {
        try {
            const authResponse = await oauthClient.refreshUsingToken(config.refreshToken);

            // Log Intuit TID if available
            if (authResponse && typeof authResponse.get_intuit_tid === 'function') {
                console.log(`[QuickBooks] Token Refresh TID: ${authResponse.get_intuit_tid()}`);
            }

            const token = authResponse.getJson();

            const updatedConfig = await updateQuickBooksConfig({
                accessToken: token.access_token,
                refreshToken: token.refresh_token,
                tokenExpiresAt: new Date(Date.now() + token.expires_in * 1000),
                refreshExpiresAt: new Date(Date.now() + token.x_refresh_token_expires_in * 1000),
            });

            return updatedConfig.accessToken;
        } catch (error) {
            console.error('Error refreshing QuickBooks token:', error);
            return null;
        }
    }

    return config.accessToken;
}
