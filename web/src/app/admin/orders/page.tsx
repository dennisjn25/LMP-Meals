import { db } from "@/lib/db";
import { getOrdersAdmin, updateOrderStatus } from "@/actions/orders";
import AdminOrderList from "@/components/admin/AdminOrderList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

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

    // Serialize data for client components
    const serializedOrders = JSON.parse(JSON.stringify(orders));
    const serializedMeals = JSON.parse(JSON.stringify(meals));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xl, paddingBottom: tokens.spacing.xxl }}>
            <div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: '1',
                    marginBottom: tokens.spacing.sm,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>Orders</h1>
                <p style={{ color: tokens.colors.text.secondary, fontSize: '1.25rem', fontWeight: 500 }}>
                    Track and manage customer orders, payments, and delivery fulfillment.
                </p>
            </div>

            <AdminOrderList initialOrders={serializedOrders} meals={serializedMeals} />
        </div>
    );
}



