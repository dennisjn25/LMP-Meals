import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const meals = await db.meal.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                include: {
                    order: true
                }
            }
        }
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
                }}>INVENTORY</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Monitor meal availability, track stock levels, and manage menu status.
                </p>
            </div>

            <AdminInventoryClient meals={meals as any[]} />
        </div>
    );
}

