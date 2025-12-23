"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserOrders() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return [];
    }

    // @ts-ignore
    return await db.order.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            items: {
                include: {
                    meal: true
                }
            }
        }
    });
}

export async function getUserSettings() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { sendReceiptEmail: true }
    });

    return user;
}

export async function updateEmailPreference(sendReceiptEmail: boolean) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.user.update({
        where: { id: session.user.id },
        data: { sendReceiptEmail }
    });

    return { success: true };
}
