"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Users,
    Eye,
    Clock,
    ArrowDownRight,
    ArrowUpRight,
    Globe,
    Navigation2,
    MoreHorizontal,
    Info,
    TrendingUp,
    DollarSign,
    ShoppingBag
} from "lucide-react";
import { generateSparklinePath, formatDuration, formatMetricValue } from "@/lib/analytics-utils";

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
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>
                <Info size={40} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Analytics Error</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>{error}</p>
                <button
                    onClick={() => setPeriod("7d")}
                    style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', color: '#000', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <TrendingUp size={24} color="#fbbf24" /> Business Intelligence
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>Real-time sales & performance metrics</p>
                </div>

                <div
                    role="group"
                    aria-label="Time period selector"
                    style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    {(["24h", "7d", "30d"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            aria-pressed={period === p}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: period === p ? 'white' : 'transparent',
                                color: period === p ? 'black' : '#94a3b8',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            {p === "24h" ? "24 Hours" : p === "7d" ? "7 Days" : "30 Days"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Processing Data...</span>
                    <style jsx>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : data && (
                <>
                    {/* Business Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        {data.metrics.revenue && (
                            <MetricBox
                                icon={<DollarSign size={20} />} // Note: DollarSign might need import if not already
                                label="Total Revenue"
                                data={data.metrics.revenue}
                                color="#10b981"
                            />
                        )}
                        {data.metrics.orders && (
                            <MetricBox
                                icon={<ShoppingBag size={20} />} // Note: ShoppingBag might need import
                                label="Total Orders"
                                data={data.metrics.orders}
                                color="#3b82f6"
                            />
                        )}
                        <MetricBox
                            icon={<Eye size={20} />}
                            label="Page Views"
                            data={data.metrics.pageViews}
                            color="#fbbf24"
                        />
                        <MetricBox
                            icon={<Users size={20} />}
                            label="Visitors"
                            data={data.metrics.uniqueVisitors}
                            color="#8b5cf6"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                        {/* Top Meals */}
                        {data.topMeals && data.topMeals.length > 0 && (
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Performing Meals</h3>
                                    <TrendingUp size={18} color="#94a3b8" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {data.topMeals.map((meal, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', alignItems: 'center' }}>
                                                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{meal.name}</span>
                                                <span style={{ color: '#fbbf24', fontWeight: 800 }}>{meal.count} orders</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(meal.count / (data.topMeals?.[0]?.count || 1)) * 100}%`, height: '100%', background: '#fbbf24', borderRadius: '99px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Traffic Sources */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Traffic Sources</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {data.trafficSources.map((source) => (
                                    <div key={source.source}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{source.source}</span>
                                            <span style={{ color: 'white', fontWeight: 800 }}>{source.value}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
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
    );
}

function MetricBox({ icon, label, data, color, invertTrend = false, isTime = false }: { icon: React.ReactNode, label: string, data: MetricData, color: string, invertTrend?: boolean, isTime?: boolean }) {
    const percentageChange = ((data.current - data.previous) / data.previous) * 100;
    const isUp = percentageChange >= 0;
    const isGood = invertTrend ? !isUp : isUp;

    const formattedValue = useMemo(() => {
        if (isTime) return formatDuration(data.current);
        return formatMetricValue(data.current) + data.unit;
    }, [data.current, data.unit, isTime]);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.3s ease',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${color}15`,
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
                        color: isGood ? '#10b981' : '#ef4444',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: isGood ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '99px'
                    }}
                    aria-label={`${Math.abs(percentageChange).toFixed(1)}% ${isUp ? 'increase' : 'decrease'} from previous period`}
                >
                    {isUp ? <ArrowUpRight size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
                    {Math.abs(percentageChange).toFixed(1)}%
                </div>
            </div>

            <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{formattedValue}</div>
            </div>

            {/* Sparkline */}
            <div style={{ marginTop: '20px', height: '30px', width: '100%' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                        d={generateSparklinePath(data.trend)}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ opacity: 0.8 }}
                    />
                </svg>
            </div>
        </div>
    );
}
