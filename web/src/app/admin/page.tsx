import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminUserList from "@/components/admin/user-list";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }


    const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'white',
                        lineHeight: '1',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>ADMIN DASHBOARD</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px' }}>
                        Central dashboard for managing users, menu, and orders.
                    </p>
                </div>
                <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    color: '#fbbf24',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Total Users: {users.length}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <DashboardCard
                    title="Meal Management"
                    description="Update menu items, macros, and prices."
                    href="/admin/meals"
                    cta="Manage Meals"
                />
                <DashboardCard
                    title="Order Processing"
                    description="View and manage customer orders and fulfillment."
                    href="/admin/orders"
                    cta="Manage Orders"
                />
                <DashboardCard
                    title="Financial Overview"
                    description="Track revenue and business performance."
                    href="/admin/finances"
                    cta="View Finances"
                />
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'white' }}>RECENT USERS</h2>
                </div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <tr>
                            <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>User</th>
                            <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Role</th>
                            <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Created</th>
                            <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <AdminUserList key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function DashboardCard({ title, description, href, cta }: { title: string, description: string, href: string, cta: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all 0.3s ease'
        }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-heading)' }}>{title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>
            <a href={href} style={{
                marginTop: 'auto',
                padding: '12px 24px',
                background: 'white',
                color: 'black',
                borderRadius: '12px',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s'
            }}>
                {cta}
            </a>
        </div>
    )
}

