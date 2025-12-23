import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Truck, MapPin, ChevronRight, CheckCircle2, Clock } from "lucide-react";

export default async function DriverDashboard() {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "DRIVER" && session?.user?.role !== "ADMIN") {
        redirect("/login?callbackUrl=/driver");
    }

    const userId = session?.user?.id;

    // Fetch active routes for this driver
    const activeRoutes = await db.route.findMany({
        where: {
            driverId: userId,
            status: { in: ["PLANNED", "ACTIVE"] }
        },
        include: {
            deliveries: {
                include: {
                    order: true
                }
            }
        },
        orderBy: { date: 'desc' }
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0B0E14',
            color: 'white',
            padding: '20px',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Driver <span style={{ color: 'var(--primary)' }}>Panel</span></h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Welcome back, {session?.user?.name || 'Driver'}</p>
                </div>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {session?.user?.name?.[0] || 'D'}
                </div>
            </header>

            <section>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} color="var(--primary)" /> Active Routes
                </h2>

                {activeRoutes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activeRoutes.map((route) => (
                            <Link key={route.id} href={`/driver/route/${route.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'var(--card-bg)',
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                                            Route #{route.id.slice(-4)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={14} /> {route.deliveries.length} Stops
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> {new Date(route.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '12px' }}>
                                            <StatusBadge status={route.status} />
                                        </div>
                                    </div>
                                    <ChevronRight size={24} color="#475569" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: 'var(--card-bg)',
                        borderRadius: '20px',
                        border: '1px solid var(--glass-border)',
                        color: '#64748b'
                    }}>
                        <Truck size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                        <p>No routes assigned to you today.</p>
                    </div>
                )}
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Stats</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.5rem' }}>0</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Today's Deliveries</div>
                    </div>
                    <div style={{ background: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.5rem' }}>0%</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Completion Rate</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        PLANNED: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
        ACTIVE: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
        COMPLETED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    };
    const config = colors[status] || colors.PLANNED;
    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '12px',
            background: config.bg,
            color: config.text,
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase'
        }}>
            {status}
        </span>
    );
}
