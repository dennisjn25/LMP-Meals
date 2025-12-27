"use client";

import Image from 'next/image';
import { Flame, Zap, Heart, TrendingUp, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { tokens } from "@/lib/design-tokens";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

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

    // Determine category color (keep specific colors for categories)
    const getCategoryColor = () => {
        if (meal.tags.includes('High Protein')) return { bg: 'rgba(239, 68, 68, 0.1)', border: tokens.colors.text.error, text: tokens.colors.text.error };
        if (meal.tags.includes('Keto')) return { bg: 'rgba(16, 185, 129, 0.1)', border: tokens.colors.text.success, text: tokens.colors.text.success };
        if (meal.tags.includes('Balanced')) return { bg: tokens.colors.accent.light, border: tokens.colors.accent.DEFAULT, text: tokens.colors.accent.DEFAULT };
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
                background: tokens.colors.surface.light,
                borderRadius: tokens.radius.xl,
                overflow: 'hidden',
                boxShadow: isHovered
                    ? `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px ${tokens.colors.accent.light}`
                    : tokens.shadows.lg,
                transition: tokens.transitions.normal,
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${tokens.colors.border.dark}`
            }}
        >
            {/* Image Container */}
            <div style={{
                position: 'relative',
                height: '260px',
                width: '100%',
                overflow: 'hidden',
                background: tokens.colors.surface.dark
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
                    background: `linear-gradient(to top, ${tokens.colors.surface.light} 0%, transparent 100%)`,
                    pointerEvents: 'none'
                }} />

                {/* Price Tag */}
                <div style={{
                    position: 'absolute',
                    top: tokens.spacing.md,
                    right: tokens.spacing.md,
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${tokens.colors.accent.light}`,
                    color: tokens.colors.accent.DEFAULT,
                    padding: '8px 16px',
                    borderRadius: tokens.radius.lg,
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    boxShadow: tokens.shadows.md,
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.02em',
                    lineHeight: 1
                }}>
                    ${meal.price.toFixed(2)}
                </div>

                {/* Quick Stats Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: tokens.spacing.md,
                    left: tokens.spacing.md,
                    right: tokens.spacing.md,
                    display: 'flex',
                    gap: tokens.spacing.sm,
                    flexWrap: 'wrap'
                }}>
                    <QuickStat icon={<Flame size={14} />} value={meal.calories} label="cal" color={tokens.colors.text.error} />
                    <QuickStat icon={<Zap size={14} />} value={`${meal.protein}g`} label="protein" color={tokens.colors.accent.DEFAULT} />
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: tokens.spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Tags */}
                <div style={{ display: 'flex', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md, flexWrap: 'wrap' }}>
                    {meal.tags.slice(0, 2).map(tag => {
                        // Determine tag-specific colors
                        let tagColor = categoryColor;
                        if (tag === 'GF') {
                            tagColor = { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#3b82f6' }; // Blue
                        } else if (tag === 'High Protein') {
                            tagColor = { bg: 'rgba(239, 68, 68, 0.1)', border: tokens.colors.text.error, text: tokens.colors.text.error }; // Red
                        }

                        return (
                            <span key={tag} style={{
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 700,
                                background: tagColor.bg,
                                border: `1px solid ${tagColor.border}`,
                                color: tagColor.text,
                                padding: '6px 12px',
                                borderRadius: tokens.radius.full,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {tag}
                            </span>
                        );
                    })}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.4rem',
                    marginBottom: tokens.spacing.md,
                    lineHeight: 1.2,
                    minHeight: '3.4rem',
                    color: tokens.colors.text.primary,
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
                    marginBottom: tokens.spacing.lg,
                    background: tokens.colors.surface.medium,
                    borderRadius: tokens.radius.lg,
                    border: `1px solid ${tokens.colors.border.dark}`,
                    overflow: 'hidden'
                }}>
                    <MacroItem icon={<TrendingUp size={16} />} label="Protein" value={`${meal.protein}g`} color={tokens.colors.accent.DEFAULT} style={{ borderRight: `1px solid ${tokens.colors.border.dark}` }} />
                    <MacroItem icon={<Heart size={16} />} label="Carbs" value={`${meal.carbs}g`} color="#3b82f6" style={{ borderRight: `1px solid ${tokens.colors.border.dark}` }} />
                    <MacroItem icon={<Zap size={16} />} label="Fat" value={`${meal.fat}g`} color={tokens.colors.text.success} />
                </div>

                {/* Add Button */}
                <Button
                    onClick={handleAdd}
                    disabled={isAdded}
                    fullWidth
                    style={{
                        background: isAdded
                            ? tokens.colors.text.success
                            : isInCart
                                ? '#3b82f6' // Blue
                                : tokens.colors.accent.DEFAULT,
                        color: isInCart || isAdded ? 'white' : 'black',
                        border: 'none',
                        boxShadow: isAdded || isInCart ? 'none' : tokens.shadows.glow
                    }}
                >
                    {isAdded ? (
                        <>
                            <Check size={18} strokeWidth={3} style={{ marginRight: '8px' }} />
                            ADDED
                        </>
                    ) : isInCart ? (
                        <>
                            <Plus size={18} strokeWidth={3} style={{ marginRight: '8px' }} />
                            ADD MORE
                        </>
                    ) : (
                        <>
                            ADD TO CART
                        </>
                    )}
                </Button>
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
            borderRadius: tokens.radius.full,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'white',
            border: `1px solid ${color}`,
            boxShadow: tokens.shadows.sm
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
                color: tokens.colors.text.secondary,
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
                color: tokens.colors.text.primary,
                fontFamily: 'var(--font-heading)'
            }}>
                {value}
            </div>
        </div>
    );
}
