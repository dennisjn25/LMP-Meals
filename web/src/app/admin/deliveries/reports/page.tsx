import { db } from "@/lib/db";
import { BarChart3, TrendingUp, PieChart, Download, Calendar, User } from "lucide-react";

// Force dynamic rendering to prevent build-time database access
export const dynamic = "force-dynamic";

export default async function DeliveryReportsPage() {
    // Fetch stats
    const totalDeliveries = await db.delivery.count();
    const deliveredCount = await db.delivery.count({ where: { status: "DELIVERED" } });
    const failedCount = await db.delivery.count({ where: { status: "FAILED" } });

    const deliveryRate = totalDeliveries > 0 ? (deliveredCount / totalDeliveries * 100).toFixed(1) : 0;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        marginBottom: '12px',
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        textTransform: 'uppercase'
                    }}>
                        Delivery <span style={{ color: '#fbbf24' }}>Analytics</span>
                    </h1>
                    <p style={{
                        color: '#e5e7eb',
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Comprehensive insights into your delivery performance and logistical efficiency.
                    </p>
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    <Download size={18} /> Export Data
                </button>
            </div>

            {/* Performance Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <ReportTile label="Total Deliveries" value={totalDeliveries} subValue="+12% from last week" icon={<TrendingUp size={20} color="#10b981" />} />
                <ReportTile label="Success Rate" value={`${deliveryRate}%`} subValue="Target: 98%" icon={<CheckCircle size={20} color="#3b82f6" />} />
                <ReportTile label="Avg. Delivery Time" value="42m" subValue="-5m faster" icon={<Clock size={20} color="#f59e0b" />} />
                <ReportTile label="Failed Attempts" value={failedCount} subValue="2.4% rate" icon={<AlertCircle size={20} color="#ef4444" />} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* Main Efficiency Chart Mockup */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                    padding: '36px',
                    borderRadius: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.15)',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: 800,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#ffffff'
                        }}>Volume vs. Efficiency</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div> Deliveries
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Est. vs Actual
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '20px' }}>
                        {[40, 65, 45, 90, 85, 60, 75, 50, 80, 70, 95, 80].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
                                <div style={{ height: `${h}%`, width: '100%', background: 'linear-gradient(to top, var(--primary), #34d399)', borderRadius: '6px' }}></div>
                                <div style={{ height: `${h / 2}%`, width: '100%', background: '#1e293b', borderRadius: '4px' }}></div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.75rem', marginTop: '16px' }}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Driver Performance Table */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                    padding: '36px',
                    borderRadius: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.15)'
                }}>
                    <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        marginBottom: '28px'
                    }}>Top Drivers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <DriverStat name="Alex Johnson" deliveries={142} rating={4.9} />
                        <DriverStat name="Sarah Chen" deliveries={128} rating={4.8} />
                        <DriverStat name="Mike Wilson" deliveries={115} rating={4.7} />
                        <DriverStat name="Jessica Lee" deliveries={98} rating={4.9} />
                    </div>

                    <button style={{
                        width: '100%',
                        marginTop: '32px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.03))',
                        border: '2px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '12px',
                        color: '#fbbf24',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s ease'
                    }}>
                        View All Drivers
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReportTile({ label, value, subValue, icon }: any) {
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'default'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>{label}</span>
                {icon}
            </div>
            <div style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '8px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em'
            }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>{subValue}</div>
        </div>
    );
}

function DriverStat({ name, deliveries, rating }: any) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(251, 191, 36, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(251, 191, 36, 0.1)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: '#000000',
                fontFamily: 'var(--font-heading)'
            }}>{name[0]}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>{deliveries} deliveries</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>★ {rating}</div>
            </div>
        </div>
    );
}

function Clock({ size, color }: any) { return <BarChart3 size={size} color={color} />; }
function CheckCircle({ size, color }: any) { return <PieChart size={size} color={color} />; }
function AlertCircle({ size, color }: any) { return <Calendar size={size} color={color} />; }
