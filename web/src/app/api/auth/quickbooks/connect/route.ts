
import { oauthClient } from "@/lib/quickbooks";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();

    // Development bypass or ADMIN check
    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (!skipAuth && (!session || (session.user as any).role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }


    const authUri = oauthClient.authorizeUri({
        scope: [
            'com.intuit.quickbooks.accounting',
            'openid',
            'profile',
            'email'
        ],
        state: 'testState',
    });

    console.log("🔗 QuickBooks Auth URI Generated:", authUri.replace(/(client_id=)[^&]+/, '$1***HIDE***'));

    return NextResponse.redirect(authUri);
}
