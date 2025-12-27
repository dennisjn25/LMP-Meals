"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getKitchenStats } from "@/actions/orders";
import { Loader2, ChefHat, AlertCircle, RefreshCw } from "lucide-react";

interface KitchenStat {
    title: string;
    count: number;
    image: string;
    tags: string;
}

export default function KitchenDashboard() {
    const [stats, setStats] = useState<KitchenStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState(0);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        setLoading(true);
        const res = await getKitchenStats();
        if (res.success && res.data) {
            setStats(res.data);
            setTotalOrders(res.totalOrders || 0);
        } else {
            setError(res.error || "Failed to load kitchen stats");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && stats.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#94a3b8' }}>
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle />
                {error}
                <button onClick={() => window.location.reload()} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#fbbf24', padding: '12px', borderRadius: '16px', color: 'black' }}>
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 1 }}>Kitchen Prep</h1>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
                            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{totalOrders}</span> Active Orders  •  <span style={{ color: '#fbbf24', fontWeight: 700 }}>{stats.reduce((acc, curr) => acc + curr.count, 0)}</span> Total Meals
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchStats}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {stats.map((meal) => (
                    <div key={meal.title} style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                            <Image
                                src={meal.image || "/placeholder-meal.jpg"}
                                fill
                                alt={meal.title}
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '20px',
                                right: '20px'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-heading)',
                                    marginBottom: '4px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}>{meal.title}</h3>
                                {meal.tags && (
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {meal.tags.split(',').map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.7rem',
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(4px)',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontWeight: 600
                                            }}>
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>To Prepare</div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                                    {meal.count}
                                </div>
                            </div>

                            {/* Visual Progress Indication (Mockup) */}
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>0%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {stats.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <ChefHat size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Kitchen is Quiet</h3>
                    <p>No active orders to prepare right now.</p>
                </div>
            )}
        </div>
    );
}
