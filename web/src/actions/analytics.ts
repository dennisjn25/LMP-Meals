"use server";

import { db } from "@/lib/db";
import { cookies, headers } from "next/headers";

export async function trackPageView(path: string, referer: string | null) {
    try {
        const headerStore = await headers();
        const userAgent = headerStore.get("user-agent");
        const cookieStore = await cookies();
        let sessionId = cookieStore.get("analytics_session_id")?.value;

        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15);
            // In a real app, you'd set this cookie with a long expiry
            // cookieStore.set("analytics_session_id", sessionId, { maxAge: 60 * 60 * 24 * 30 });
        }

        await db.pageView.create({
            data: {
                path,
                sessionId,
                userAgent: userAgent || null,
                referer: referer || null,
            }
        });

        // Also ensure a session exists
        const sessionExists = await db.analyticsSession.findUnique({
            where: { id: sessionId }
        }).catch(() => null);

        if (!sessionExists) {
            await db.analyticsSession.create({
                data: {
                    id: sessionId,
                    startedAt: new Date(),
                }
            }).catch(() => { });
        }

    } catch (error) {
        console.error("Failed to track page view:", error);
    }
}
