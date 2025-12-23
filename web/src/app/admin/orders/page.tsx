import { db } from "@/lib/db";
import { getOrdersAdmin, updateOrderStatus } from "@/actions/orders";
import Navbar from "@/components/Navbar";
import AdminOrderList from "@/components/admin/AdminOrderList";

export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }


    const orders = await getOrdersAdmin();
    const meals = await db.meal.findMany({
        where: { available: true },
        select: { id: true, title: true, price: true }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: '1',
                    marginBottom: '12px'
                }}>ORDERS</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Track and manage customer orders, payments, and delivery fulfillment.
                </p>
            </div>

            <AdminOrderList initialOrders={orders as any[]} meals={meals} />
        </div>
    );
}

