import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminFinancesClient from "@/components/admin/AdminFinancesClient";

export const dynamic = "force-dynamic";

export default async function AdminFinancesPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    // Get all orders with items
    const orders = await db.order.findMany({
        include: {
            items: {
                include: {
                    meal: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate financial metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const paidRevenue = orders
        .filter(o => ['PAID', 'COMPLETED', 'DELIVERED'].includes(o.status))
        .reduce((sum, order) => sum + order.total, 0);
    const pendingRevenue = orders
        .filter(o => o.status === 'PENDING')
        .reduce((sum, order) => sum + order.total, 0);

    // Get expenses
    const expenses = await db.expense.findMany({
        orderBy: { date: 'desc' }
    });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);


    // Get QuickBooks config
    const qbConfig = await db.quickBooksConfig.findFirst({
        where: { env: process.env.QB_ENV || 'sandbox' }
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
                }}>FINANCES</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Real-time financial tracking, QuickBooks synchronization, and profit analysis.
                </p>
            </div>

            <AdminFinancesClient
                orders={orders as any[]}
                totalRevenue={totalRevenue}
                paidRevenue={paidRevenue}
                pendingRevenue={pendingRevenue}
                totalExpenses={totalExpenses}
                expenses={expenses as any[]}
                qbConnected={!!qbConfig?.accessToken}
                lastSyncAt={qbConfig?.lastSyncAt || null}
            />
        </div>
    );
}


