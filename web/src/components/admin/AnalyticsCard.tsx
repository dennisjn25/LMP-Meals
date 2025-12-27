"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Users,
    Eye,
    ArrowDownRight,
    ArrowUpRight,
    TrendingUp,
    DollarSign,
    ShoppingBag
} from "lucide-react";
import { generateSparklinePath, formatDuration, formatMetricValue } from "@/lib/analytics-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { tokens } from "@/lib/design-tokens";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
    metrics: {
        revenue?: MetricData;
        orders?: MetricData;
        pageViews: MetricData;
        uniqueVisitors: MetricData;
        bounceRate: MetricData;
        sessionDuration: MetricData;
    };
    trafficSources: { source: string; value: number; color: string }[];
    geoDistribution: { region: string; visitors: number }[];
    topMeals?: { name: string; count: number }[];
}

interface MetricData {
    current: number;
    previous: number;
    trend: number[];
    unit: string;
}

export default function AnalyticsCard() {
    const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/analytics?period=${period}`);
                if (!response.ok) throw new Error("Failed to fetch analytics");
                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [period]);

    if (error) {
        return (
            <Card style={{ textAlign: 'center', borderColor: tokens.colors.text.error }}>
                <CardContent style={{ padding: tokens.spacing.xxl, color: tokens.colors.text.error }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Analytics Error</h3>
                    <p style={{ color: tokens.colors.text.secondary, marginTop: tokens.spacing.sm }}>{error}</p>
                    <button
                        onClick={() => setPeriod("7d")}
                        style={{
                            marginTop: tokens.spacing.lg,
                            padding: '12px 24px',
                            background: '#fff',
                            color: '#000',
                            borderRadius: tokens.radius.md,
                            fontWeight: 900,
                            border: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        Retry
                    </button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card style={{ overflow: 'hidden', padding: '0' }}>
            <div style={{ padding: tokens.spacing.xl }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: tokens.spacing.lg, marginBottom: tokens.spacing.xl }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: tokens.spacing.md, margin: 0 }}>
                            <TrendingUp size={24} color={tokens.colors.accent.DEFAULT} /> BUSINESS INTELLIGENCE
                        </h2>
                        <p style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem', marginTop: '4px', margin: 0, fontWeight: 500 }}>Real-time sales & performance metrics</p>
                    </div>

                    <div
                        role="group"
                        aria-label="Time period selector"
                        style={{ display: 'flex', background: tokens.colors.surface.medium, padding: '4px', borderRadius: tokens.radius.md, border: `1px solid ${tokens.colors.border.dark}` }}
                    >
                        {(["24h", "7d", "30d"] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                aria-pressed={period === p}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: tokens.radius.sm,
                                    border: 'none',
                                    background: period === p ? 'white' : 'transparent',
                                    color: period === p ? 'black' : tokens.colors.text.secondary,
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: tokens.transitions.fast,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {p === "24h" ? "24H" : p === "7d" ? "7D" : "30D"}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <AnalyticsSkeleton />
                ) : data && (
                    <>
                        {/* Business Metrics Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: tokens.spacing.lg, marginBottom: tokens.spacing.xl }}>
                            {data.metrics.revenue && (
                                <MetricBox
                                    icon={<DollarSign size={20} />}
                                    label="Total Revenue"
                                    data={data.metrics.revenue}
                                    color={tokens.colors.accent.DEFAULT}
                                    isCurrency
                                />
                            )}
                            {data.metrics.orders && (
                                <MetricBox
                                    icon={<ShoppingBag size={20} />}
                                    label="Total Orders"
                                    data={data.metrics.orders}
                                    color="#3b82f6"
                                />
                            )}
                            <MetricBox
                                icon={<Eye size={20} />}
                                label="Page Views"
                                data={data.metrics.pageViews}
                                color="#8b5cf6"
                            />
                            <MetricBox
                                icon={<Users size={20} />}
                                label="Visitors"
                                data={data.metrics.uniqueVisitors}
                                color="#ec4899"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: tokens.spacing.xl }}>
                            {/* Top Meals */}
                            {data.topMeals && data.topMeals.length > 0 && (
                                <div style={{ background: tokens.colors.surface.medium, padding: tokens.spacing.xl, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border.dark}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.xl }}>
                                        <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Top Performing Meals</h3>
                                        <TrendingUp size={18} color={tokens.colors.accent.DEFAULT} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
                                        {data.topMeals.map((meal, i) => (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.xs, fontSize: '0.9rem', alignItems: 'center' }}>
                                                    <span style={{ color: 'white', fontWeight: 700 }}>{meal.name}</span>
                                                    <span style={{ color: tokens.colors.accent.DEFAULT, fontWeight: 900 }}>{meal.count}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', background: tokens.colors.surface.dark, borderRadius: '99px', overflow: 'hidden', border: `1px solid ${tokens.colors.border.dark}` }}>
                                                    <div style={{ width: `${(meal.count / (data.topMeals?.[0]?.count || 1)) * 100}%`, height: '100%', background: tokens.colors.accent.DEFAULT, borderRadius: '99px' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Traffic Sources */}
                            <div style={{ background: tokens.colors.surface.medium, padding: tokens.spacing.xl, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border.dark}` }}>
                                <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 900, fontFamily: 'var(--font-heading)', marginBottom: tokens.spacing.xl, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Traffic Sources</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
                                    {data.trafficSources.map((source) => (
                                        <div key={source.source}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.xs, fontSize: '0.85rem' }}>
                                                <span style={{ color: tokens.colors.text.secondary, fontWeight: 800, textTransform: 'uppercase' }}>{source.source}</span>
                                                <span style={{ color: 'white', fontWeight: 900 }}>{source.value}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: tokens.colors.surface.dark, borderRadius: '99px', overflow: 'hidden', border: `1px solid ${tokens.colors.border.dark}` }}>
                                                <div style={{ width: `${source.value}%`, height: '100%', background: source.color, borderRadius: '99px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}

function MetricBox({ icon, label, data, color, invertTrend = false, isTime = false, isCurrency = false }: { icon: React.ReactNode, label: string, data: MetricData, color: string, invertTrend?: boolean, isTime?: boolean, isCurrency?: boolean }) {
    const percentageChange = ((data.current - data.previous) / data.previous) * 100;
    const isUp = percentageChange >= 0;
    const isGood = invertTrend ? !isUp : isUp;

    const formattedValue = useMemo(() => {
        if (isTime) return formatDuration(data.current);
        if (isCurrency) return formatCurrency(data.current);
        return formatMetricValue(data.current) + data.unit;
    }, [data.current, data.unit, isTime, isCurrency]);

    return (
        <div style={{
            background: tokens.colors.surface.medium,
            border: `1px solid ${tokens.colors.border.dark}`,
            borderRadius: tokens.radius.lg,
            position: 'relative',
            padding: tokens.spacing.lg,
            transition: tokens.transitions.normal,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.spacing.md }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: tokens.radius.md,
                    background: `${color}20`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isGood ? tokens.colors.text.success : tokens.colors.text.error,
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        background: isGood ? `${tokens.colors.text.success}15` : `${tokens.colors.text.error}15`,
                        padding: '4px 8px',
                        borderRadius: tokens.radius.sm,
                        border: `1px solid ${isGood ? `${tokens.colors.text.success}30` : `${tokens.colors.text.error}30`}`
                    }}
                >
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(percentageChange).toFixed(1)}%
                </div>
            </div>

            <div>
                <div style={{ fontSize: '0.75rem', color: tokens.colors.text.secondary, marginBottom: '2px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{formattedValue}</div>
            </div>

            {/* Sparkline */}
            <div style={{ marginTop: tokens.spacing.lg, height: '30px', width: '100%', opacity: 0.6 }}>
                <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                        d={generateSparklinePath(data.trend)}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

function AnalyticsSkeleton() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: tokens.spacing.lg }}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: '180px', background: tokens.colors.surface.medium, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border.dark}` }}>
                    <div style={{ padding: tokens.spacing.lg }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.xl }}>
                            <Skeleton width="40px" height="40px" borderRadius={tokens.radius.md} style={{ background: tokens.colors.surface.dark }} />
                            <Skeleton width="60px" height="24px" borderRadius={tokens.radius.sm} style={{ background: tokens.colors.surface.dark }} />
                        </div>
                        <Skeleton width="100px" height="12px" style={{ marginBottom: tokens.spacing.sm, background: tokens.colors.surface.dark }} />
                        <Skeleton width="140px" height="32px" style={{ marginBottom: tokens.spacing.lg, background: tokens.colors.surface.dark }} />
                        <Skeleton width="100%" height="30px" style={{ background: tokens.colors.surface.dark }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

