"use client";

import Image from 'next/image';
import { Flame, Zap, Heart, TrendingUp, Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface MealProps {
    id: string;
    title: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    price: number;
    tags: string[];
}

import { useCart } from "@/context/CartContext";

export default function MealCard({ meal }: { meal: MealProps }) {
    const { addToCart, items } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isInCart = items.some(item => item.id === meal.id);

    const handleAdd = () => {
        addToCart({
            id: meal.id,
            title: meal.title,
            price: meal.price,
            image: meal.image,
            calories: meal.calories
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Determine category color
    const getCategoryColor = () => {
        if (meal.tags.includes('High Protein')) return { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#ef4444' };
        if (meal.tags.includes('Keto')) return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#10b981' };
        if (meal.tags.includes('Balanced')) return { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24', text: '#fbbf24' };
        return { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#3b82f6' };
    };

    const categoryColor = getCategoryColor();

    return (
        <div
            className="enhanced-meal-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                background: '#1E293B',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: isHovered
                    ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(251, 191, 36, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Image Container */}
            <div style={{
                position: 'relative',
                height: '260px',
                width: '100%',
                overflow: 'hidden',
                background: '#0F172A'
            }}>
                <Image
                    src={meal.image}
                    alt={meal.title}
                    fill
                    style={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        opacity: isHovered ? 1 : 0.9
                    }}
                />

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, #1E293B 0%, transparent 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Price Tag */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    color: '#fbbf24',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.02em',
                    lineHeight: 1
                }}>
                    ${meal.price.toFixed(2)}
                </div>

                {/* Quick Stats Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    <QuickStat icon={<Flame size={14} />} value={meal.calories} label="cal" color="#ef4444" />
                    <QuickStat icon={<Zap size={14} />} value={`${meal.protein}g`} label="protein" color="#fbbf24" />
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {meal.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                            background: categoryColor.bg,
                            border: `1px solid ${categoryColor.border}`,
                            color: categoryColor.text,
                            padding: '6px 12px',
                            borderRadius: '100px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.4rem',
                    marginBottom: '16px',
                    lineHeight: 1.2,
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    fontWeight: 700
                }}>
                    {meal.title}
                </h3>

                {/* Macros Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden'
                }}>
                    <MacroItem icon={<TrendingUp size={16} />} label="Protein" value={`${meal.protein}g`} color="#fbbf24" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }} />
                    <MacroItem icon={<Heart size={16} />} label="Carbs" value={`${meal.carbs}g`} color="#3b82f6" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }} />
                    <MacroItem icon={<Zap size={16} />} label="Fat" value={`${meal.fat}g`} color="#10b981" />
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                    disabled={isAdded}
                    style={{
                        width: '100%',
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        padding: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        background: isAdded
                            ? '#10b981'
                            : isInCart
                                ? '#3b82f6'
                                : '#fbbf24',
                        color: isInCart || isAdded ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s ease',
                        boxShadow: isAdded || isInCart ? 'none' : '0 4px 15px rgba(251, 191, 36, 0.3)'
                    }}
                >
                    {isAdded ? (
                        <>
                            <Check size={18} strokeWidth={3} />
                            ADDED
                        </>
                    ) : isInCart ? (
                        <>
                            <Plus size={18} strokeWidth={3} />
                            ADD MORE
                        </>
                    ) : (
                        <>
                            ADD TO CART
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function QuickStat({ icon, value, label, color }: { icon: React.ReactNode, value: string | number, label: string, color: string }) {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            border: `1px solid ${color}`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
        }}>
            <div style={{ color }}>{icon}</div>
            <span>{value}</span>
            <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>{label}</span>
        </div>
    );
}

function MacroItem({ icon, label, value, color, style }: { icon: React.ReactNode, label: string, value: string, color: string, style?: any }) {
    return (
        <div style={{ textAlign: 'center', padding: '12px', ...style }}>
            <div style={{
                color,
                marginBottom: '6px',
                display: 'flex',
                justifyContent: 'center',
                opacity: 0.9
            }}>
                {icon}
            </div>
            <div style={{
                fontSize: '0.7rem',
                color: '#94a3b8',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
            }}>
                {label}
            </div>
            <div style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#fff',
                fontFamily: 'var(--font-heading)'
            }}>
                {value}
            </div>
        </div>
    );
}
