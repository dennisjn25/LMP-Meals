import { db } from "@/lib/db";
import { BarChart3, TrendingUp, PieChart, Download, Calendar, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Force dynamic rendering to prevent build-time database access
export const dynamic = "force-dynamic";

export default async function DeliveryReportsPage() {
    // Fetch stats
    const totalDeliveries = await db.delivery.count();
    const deliveredCount = await db.delivery.count({ where: { status: "DELIVERED" } });
    const failedCount = await db.delivery.count({ where: { status: "FAILED" } });

    const deliveryRate = totalDeliveries > 0 ? (deliveredCount / totalDeliveries * 100).toFixed(1) : 0;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: tokens.spacing.xxl }}>
            <div style={{ marginBottom: tokens.spacing.xxl, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: tokens.spacing.lg }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        marginBottom: tokens.spacing.sm,
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        lineHeight: 1
                    }}>
                        Delivery <span style={{ color: tokens.colors.accent.DEFAULT }}>Analytics</span>
                    </h1>
                    <p style={{
                        color: tokens.colors.text.inverseSecondary,
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Comprehensive insights into your delivery performance and logistical efficiency.
                    </p>
                </div>
                <Button variant="primary" size="lg">
                    <Download size={18} style={{ marginRight: tokens.spacing.sm }} />
                    Export Data
                </Button>
            </div>

            {/* Performance Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: tokens.spacing.lg, marginBottom: tokens.spacing.xxl }}>
                <ReportTile label="Total Deliveries" value={totalDeliveries} subValue="+12% from last week" icon={<TrendingUp size={20} color={tokens.colors.text.success} />} />
                <ReportTile label="Success Rate" value={`${deliveryRate}%`} subValue="Target: 98%" icon={<CheckCircle size={20} color="#3b82f6" />} />
                <ReportTile label="Avg. Delivery Time" value="42m" subValue="-5m faster" icon={<Clock size={20} color={tokens.colors.accent.DEFAULT} />} />
                <ReportTile label="Failed Attempts" value={failedCount} subValue="2.4% rate" icon={<AlertCircle size={20} color={tokens.colors.text.error} />} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: tokens.spacing.xl }}>
                {/* Main Efficiency Chart Mockup */}
                <Card style={{
                    padding: tokens.spacing.xl,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '450px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.xl }}>
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: 900,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#ffffff',
                            margin: 0
                        }}>Volume vs. Efficiency</h3>
                        <div style={{ display: 'flex', gap: tokens.spacing.md }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: tokens.colors.text.secondary, fontWeight: 700 }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tokens.colors.accent.DEFAULT }}></div> DELIVERIES
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: tokens.colors.text.secondary, fontWeight: 700 }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> EFFICIENCY
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: tokens.spacing.md, paddingBottom: tokens.spacing.lg }}>
                        {[40, 65, 45, 90, 85, 60, 75, 50, 80, 70, 95, 80].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '6px' }}>
                                <div style={{ height: `${h}%`, width: '100%', background: `linear-gradient(to top, ${tokens.colors.accent.DEFAULT}, #fbbf24)`, borderRadius: '4px', opacity: 0.8 }}></div>
                                <div style={{ height: `${h / 2}%`, width: '100%', background: tokens.colors.surface.medium, borderRadius: '4px' }}></div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.colors.text.secondary, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </Card>

                {/* Driver Performance Table */}
                <Card style={{
                    padding: tokens.spacing.xl
                }}>
                    <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        marginBottom: tokens.spacing.xl,
                        margin: 0
                    }}>Top Drivers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
                        <DriverStat name="Alex Johnson" deliveries={142} rating={4.9} />
                        <DriverStat name="Sarah Chen" deliveries={128} rating={4.8} />
                        <DriverStat name="Mike Wilson" deliveries={115} rating={4.7} />
                        <DriverStat name="Jessica Lee" deliveries={98} rating={4.9} />
                    </div>

                    <Button variant="outline" style={{ width: '100%', marginTop: tokens.spacing.xl, borderColor: tokens.colors.border.dark, color: 'white' }}>
                        View All Drivers
                    </Button>
                </Card>
            </div>
        </div>
    );
}

function ReportTile({ label, value, subValue, icon }: any) {
    return (
        <Card style={{
            padding: tokens.spacing.xl,
            transition: tokens.transitions.normal,
            cursor: 'default'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.lg }}>
                <span style={{
                    color: tokens.colors.text.secondary,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>{label}</span>
                {icon}
            </div>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: tokens.spacing.xs,
                fontFamily: 'var(--font-heading)',
                lineHeight: 1
            }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: tokens.colors.text.success, fontWeight: 700 }}>{subValue}</div>
        </Card>
    );
}

function DriverStat({ name, deliveries, rating }: any) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.md,
            padding: tokens.spacing.md,
            background: tokens.colors.surface.medium,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.border.dark}`,
            transition: tokens.transitions.normal
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                background: tokens.colors.accent.DEFAULT,
                borderRadius: tokens.radius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: '#000000',
                fontFamily: 'var(--font-heading)'
            }}>{name[0]}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary, fontWeight: 500 }}>{deliveries} deliveries</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: tokens.colors.accent.DEFAULT, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>★ {rating}</div>
            </div>
        </div>
    );
}
