
import { syncData } from "@/lib/quickbooks-sync";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST() {
    const session = await auth();

    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (!skipAuth && (!session || (session.user as any).role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const results = await syncData();
        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Manual Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
