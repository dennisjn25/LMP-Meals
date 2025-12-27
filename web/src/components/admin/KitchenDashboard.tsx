"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getKitchenStats } from "@/actions/orders";
import { Loader2, ChefHat, AlertCircle, RefreshCw } from "lucide-react";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && stats.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: tokens.colors.text.secondary }}>
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <Card style={{ padding: tokens.spacing.xl, background: 'rgba(239, 68, 68, 0.1)', borderColor: tokens.colors.text.error }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, color: tokens.colors.text.error }}>
                    <AlertCircle />
                    <span style={{ fontWeight: 600 }}>{error}</span>
                    <Button onClick={() => fetchStats()} variant="danger" size="sm" style={{ marginLeft: 'auto' }}>
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: tokens.spacing.xxl }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.xxl, flexWrap: 'wrap', gap: tokens.spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.lg }}>
                    <div style={{ background: tokens.colors.accent.DEFAULT, padding: tokens.spacing.md, borderRadius: tokens.radius.lg, color: 'black' }}>
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 1 }}>Kitchen Prep</h1>
                        <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '1rem', marginTop: tokens.spacing.xs }}>
                            <span style={{ color: tokens.colors.accent.DEFAULT, fontWeight: 700 }}>{totalOrders}</span> Active Orders  •  <span style={{ color: tokens.colors.accent.DEFAULT, fontWeight: 700 }}>{stats.reduce((acc, curr) => acc + curr.count, 0)}</span> Total Meals
                        </p>
                    </div>
                </div>
                <Button
                    onClick={fetchStats}
                    variant="ghost"
                    style={{ border: `1px solid ${tokens.colors.border.dark}`, transition: tokens.transitions.normal }}
                >
                    <RefreshCw size={20} style={{ marginRight: tokens.spacing.sm }} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: tokens.spacing.xl
            }}>
                {stats.map((meal) => (
                    <Card key={meal.title} style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: '180px', width: '100%' }}>
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
                                bottom: tokens.spacing.md,
                                left: tokens.spacing.lg,
                                right: tokens.spacing.lg
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1.25rem',
                                    fontFamily: 'var(--font-heading)',
                                    marginBottom: tokens.spacing.sm,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    textTransform: 'uppercase'
                                }}>{meal.title}</h3>
                                {meal.tags && (
                                    <div style={{ display: 'flex', gap: tokens.spacing.xs, flexWrap: 'wrap' }}>
                                        {meal.tags.split(',').map(tag => (
                                            <Badge key={tag} variant="outline" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem' }}>
                                                {tag.trim().toUpperCase()}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: tokens.spacing.xl, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: tokens.colors.surface.medium }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: tokens.colors.text.inverseSecondary, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>To Prepare</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                                    {meal.count}
                                </div>
                            </div>

                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                border: `4px solid ${tokens.colors.border.dark}`,
                                borderTop: `4px solid ${tokens.colors.accent.DEFAULT}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.2)'
                            }}>
                                <span style={{ fontSize: '0.8rem', color: tokens.colors.accent.DEFAULT, fontWeight: 900 }}>0%</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {stats.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: tokens.colors.text.secondary }}>
                    <ChefHat size={64} style={{ marginBottom: tokens.spacing.lg, opacity: 0.3, margin: '0 auto' }} />
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>Kitchen is Quiet</h3>
                    <p style={{ fontSize: '1.1rem' }}>No active orders to prepare right now.</p>
                </div>
            )}
        </div>
    );
}
