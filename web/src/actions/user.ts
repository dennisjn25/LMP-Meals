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
        select: {
            sendReceiptEmail: true,
            phone: true,
            deliveryAddress: true,
            deliveryCity: true,
            deliveryState: true,
            deliveryZip: true,
            billingAddress: true,
            billingCity: true,
            billingState: true,
            billingZip: true,
        }
    });

    return user;
}

export async function updateUserAddress(data: {
    phone?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryZip?: string;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    billingZip?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.user.update({
        where: { id: session.user.id },
        data
    });

    return { success: true };
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
