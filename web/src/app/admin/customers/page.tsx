import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminCustomerList from "@/components/admin/AdminCustomerList";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    // Get all customers (users with role USER)
    const customers = await db.user.findMany({
        where: {
            role: 'USER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            deliveryAddress: true,
            deliveryCity: true,
            deliveryState: true,
            deliveryZip: true,
            billingAddress: true,
            billingCity: true,
            billingState: true,
            billingZip: true,
            orders: {
                include: {
                    items: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Get all orders for guest checkout customers
    const guestOrders = await db.order.findMany({
        where: {
            userId: null
        },
        include: {
            items: true
        },
        orderBy: { createdAt: 'desc' }
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
                }}>CUSTOMERS</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Monitor customer activity, order history, and relationship management.
                </p>
            </div>

            <AdminCustomerList customers={customers as any[]} guestOrders={guestOrders as any[]} />
        </div>
    );
}

