
import { oauthClient, updateQuickBooksConfig } from "@/lib/quickbooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.url;
    const { searchParams } = new URL(url);
    const realmId = searchParams.get('realmId');

    try {
        const authResponse = await oauthClient.createToken(url);

        // Log Intuit TID if available
        if (authResponse && typeof authResponse.get_intuit_tid === 'function') {
            console.log(`[QuickBooks] Auth TID: ${authResponse.get_intuit_tid()}`);
        }

        const token = authResponse.getJson();

        await updateQuickBooksConfig({
            realmId: realmId || undefined,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            tokenExpiresAt: new Date(Date.now() + token.expires_in * 1000),
            refreshExpiresAt: new Date(Date.now() + token.x_refresh_token_expires_in * 1000),
        });

        // Redirect back to finances page
        return NextResponse.redirect(new URL('/admin/finances?status=connected', req.url));
    } catch (error) {
        console.error('QuickBooks Auth Error:', error);
        return NextResponse.redirect(new URL('/admin/finances?error=auth_failed', req.url));
    }
}
