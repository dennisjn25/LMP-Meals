import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminUserList from "@/components/admin/user-list";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users as UsersIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    let users: any[] = [];
    try {
        users = await db.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }

    // Serialize users for client components (Date -> ISO string)
    const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
        emailVerified: user.emailVerified instanceof Date ? user.emailVerified.toISOString() : user.emailVerified,
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xxl }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: tokens.spacing.lg }}>
                <div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'white',
                        lineHeight: '1',
                        marginBottom: tokens.spacing.sm,
                        letterSpacing: '-0.02em',
                        fontWeight: 900
                    }}>ADMIN DASHBOARD</h1>
                    <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '1.1rem', maxWidth: '600px' }}>
                        Central dashboard for managing users, menu, and orders.
                    </p>
                </div>
                <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: `1px solid ${tokens.colors.accent.DEFAULT}4D`,
                    color: tokens.colors.accent.DEFAULT,
                    padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
                    borderRadius: tokens.radius.lg,
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacing.sm
                }}>
                    <UsersIcon size={20} /> Total Users: {users.length}
                </div>
            </div>

            <AnalyticsCard />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: tokens.spacing.xl }}>
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

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: tokens.spacing.xl, borderBottom: `1px solid ${tokens.colors.border.dark}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 700 }}>RECENT USERS</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead style={{ background: tokens.colors.surface.medium }}>
                            <tr>
                                <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>User</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Role</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Created</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serializedUsers.map((user) => (
                                <AdminUserList key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

function DashboardCard({ title, description, href, cta }: { title: string, description: string, href: string, cta: string }) {
    return (
        <Card style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.md,
            padding: tokens.spacing.xl,
            transition: tokens.transitions.normal
        }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>
            <Link href={href} style={{ marginTop: 'auto', textDecoration: 'none' }}>
                <Button fullWidth variant="secondary">
                    {cta}
                </Button>
            </Link>
        </Card>
    )
}


