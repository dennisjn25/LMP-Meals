"use client";

import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Gift, TrendingUp, X } from 'lucide-react';
import { tokens } from "@/lib/design-tokens";
import { useSession } from "next-auth/react";

interface UserProgress {
    points: number;
    level: number;
    ordersThisWeek: number;
    currentStreak: number;
    totalOrders: number;
    achievements: string[];
}

export default function RewardsTracker() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<UserProgress>({
        points: 0,
        level: 1,
        ordersThisWeek: 0,
        currentStreak: 0,
        totalOrders: 0,
        achievements: []
    });
    const [showRewards, setShowRewards] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('liberty-rewards');
        if (saved) {
            setProgress(JSON.parse(saved));
        }
    }, []);

    if (!session?.user) return null;

    const pointsToNextLevel = progress.level * 100;
    const progressPercent = (progress.points % 100) / pointsToNextLevel * 100;

    const achievements = [
        { id: 'first-order', name: 'First Steps', icon: '🎯', description: 'Place your first order', unlocked: progress.totalOrders >= 1 },
        { id: 'week-warrior', name: 'Week Warrior', icon: '💪', description: 'Order 5 meals in one week', unlocked: progress.ordersThisWeek >= 5 },
        { id: 'streak-master', name: 'Streak Master', icon: '🔥', description: 'Maintain a 4-week streak', unlocked: progress.currentStreak >= 4 },
        { id: 'health-champion', name: 'Health Champion', icon: '🏆', description: 'Reach level 5', unlocked: progress.level >= 5 },
        { id: 'loyal-customer', name: 'Loyal Customer', icon: '⭐', description: 'Place 20 total orders', unlocked: progress.totalOrders >= 20 },
        { id: 'nutrition-guru', name: 'Nutrition Guru', icon: '🥗', description: 'Try all meal categories', unlocked: false },
    ];

    return (
        <>
            {/* Floating Rewards Button */}
            <button
                onClick={() => setShowRewards(!showRewards)}
                className="rewards-fab"
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${tokens.colors.accent.light} 0%, ${tokens.colors.accent.DEFAULT} 100%)`,
                    border: '3px solid white',
                    boxShadow: tokens.shadows.glow,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                    transition: tokens.transitions.normal,
                    animation: 'pulse-glow 2s ease-in-out infinite'
                }}
            >
                <Trophy size={28} color="white" />
                {progress.points > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: tokens.colors.text.error,
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        border: '2px solid white'
                    }}>
                        {progress.level}
                    </div>
                )}
            </button>

            {/* Rewards Panel */}
            {showRewards && (
                <div style={{
                    position: 'fixed',
                    bottom: '170px',
                    right: '24px',
                    width: '360px',
                    maxHeight: '600px',
                    background: `linear-gradient(135deg, ${tokens.colors.surface.dark} 0%, #0a0a0a 100%)`,
                    borderRadius: tokens.radius.xl,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    zIndex: 998,
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        background: `linear-gradient(135deg, ${tokens.colors.accent.light} 0%, ${tokens.colors.accent.DEFAULT} 100%)`,
                        padding: tokens.spacing.lg,
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing.sm }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                                REWARDS
                            </h3>
                            <button
                                onClick={() => setShowRewards(false)}
                                style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            Level {progress.level} • {progress.points} Points
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ padding: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.border.dark}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: tokens.colors.text.inverseSecondary, fontSize: '0.85rem' }}>
                            <span>Progress to Level {progress.level + 1}</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                background: `linear-gradient(90deg, ${tokens.colors.accent.light} 0%, ${tokens.colors.accent.DEFAULT} 100%)`,
                                transition: 'width 0.5s ease',
                                boxShadow: `0 0 10px ${tokens.colors.accent.light}`
                            }} />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: tokens.spacing.md,
                        padding: tokens.spacing.lg,
                        borderBottom: `1px solid ${tokens.colors.border.dark}`
                    }}>
                        <StatCard icon={<Flame size={20} />} label="Streak" value={`${progress.currentStreak} weeks`} color={tokens.colors.text.error} />
                        <StatCard icon={<Target size={20} />} label="This Week" value={`${progress.ordersThisWeek} orders`} color="#3b82f6" />
                        <StatCard icon={<TrendingUp size={20} />} label="Total Orders" value={progress.totalOrders.toString()} color={tokens.colors.text.success} />
                        <StatCard icon={<Gift size={20} />} label="Rewards" value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`} color="#8b5cf6" />
                    </div>

                    {/* Achievements */}
                    <div style={{ padding: tokens.spacing.lg, maxHeight: '250px', overflowY: 'auto' }}>
                        <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: tokens.spacing.md, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                            ACHIEVEMENTS
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: tokens.spacing.md,
                                        padding: tokens.spacing.md,
                                        background: achievement.unlocked ? `rgba(251, 191, 36, 0.1)` : 'rgba(255,255,255,0.05)',
                                        borderRadius: tokens.radius.md,
                                        border: achievement.unlocked ? `1px solid rgba(251, 191, 36, 0.3)` : `1px solid ${tokens.colors.border.dark}`,
                                        opacity: achievement.unlocked ? 1 : 0.5,
                                        transition: tokens.transitions.normal
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>{achievement.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {achievement.name}
                                        </div>
                                        <div style={{ color: tokens.colors.text.inverseSecondary, fontSize: '0.75rem' }}>
                                            {achievement.description}
                                        </div>
                                    </div>
                                    {achievement.unlocked && (
                                        <Star size={16} fill={tokens.colors.accent.DEFAULT} color={tokens.colors.accent.DEFAULT} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .rewards-fab:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 6px 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3);
                }
            `}</style>
        </>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '12px',
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.colors.border.dark}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ color }}>{icon}</div>
                <div style={{ color: tokens.colors.text.inverseSecondary, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {label}
                </div>
            </div>
            <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>
                {value}
            </div>
        </div>
    );
}
