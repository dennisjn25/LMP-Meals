"use client";

import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Gift, TrendingUp } from 'lucide-react';

interface UserProgress {
    points: number;
    level: number;
    ordersThisWeek: number;
    currentStreak: number;
    totalOrders: number;
    achievements: string[];
}

export default function RewardsTracker() {
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
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                    transition: 'all 0.3s ease',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                }}
            >
                <Trophy size={28} color="#fff" />
                {progress.points > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        border: '2px solid #fff'
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
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    zIndex: 998,
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        padding: '20px',
                        color: '#fff'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
                                REWARDS
                            </h3>
                            <button
                                onClick={() => setShowRewards(false)}
                                style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    color: '#fff',
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
                                ×
                            </button>
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            Level {progress.level} • {progress.points} Points
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e5e7eb', fontSize: '0.85rem' }}>
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
                                background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                                transition: 'width 0.5s ease',
                                boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                            }} />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        padding: '20px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <StatCard icon={<Flame size={20} />} label="Streak" value={`${progress.currentStreak} weeks`} color="#ef4444" />
                        <StatCard icon={<Target size={20} />} label="This Week" value={`${progress.ordersThisWeek} orders`} color="#3b82f6" />
                        <StatCard icon={<TrendingUp size={20} />} label="Total Orders" value={progress.totalOrders.toString()} color="#10b981" />
                        <StatCard icon={<Gift size={20} />} label="Rewards" value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`} color="#8b5cf6" />
                    </div>

                    {/* Achievements */}
                    <div style={{ padding: '20px', maxHeight: '250px', overflowY: 'auto' }}>
                        <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                            ACHIEVEMENTS
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: achievement.unlocked ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: achievement.unlocked ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                        opacity: achievement.unlocked ? 1 : 0.5,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>{achievement.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {achievement.name}
                                        </div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                            {achievement.description}
                                        </div>
                                    </div>
                                    {achievement.unlocked && (
                                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
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
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ color }}>{icon}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {label}
                </div>
            </div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
                {value}
            </div>
        </div>
    );
}
