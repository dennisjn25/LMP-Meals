"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMissingDeliveries() {
    // Find paid orders that don't have a delivery record
    const paidOrders = await db.order.findMany({
        where: {
            status: "PAID",
            delivery: null
        }
    });

    if (paidOrders.length === 0) return { count: 0 };

    const created = await Promise.all(
        paidOrders.map(order =>
            db.delivery.create({
                data: {
                    orderId: order.id,
                    status: "PENDING"
                }
            })
        )
    );

    revalidatePath("/admin/deliveries");
    return { count: created.length };
}
