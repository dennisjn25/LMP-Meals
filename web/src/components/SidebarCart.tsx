"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { tokens } from "@/lib/design-tokens";

export default function SidebarCart() {
    const { isCartOpen, toggleCart, items, updateQuantity, removeFromCart, cartTotal } = useCart();

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    onClick={toggleCart}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        zIndex: 2000,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '450px',
                background: tokens.colors.surface.dark,
                zIndex: 2001,
                transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${tokens.colors.border.dark}`
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: `2px solid ${tokens.colors.accent.DEFAULT}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: tokens.colors.surface.medium
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontFamily: 'var(--font-heading)',
                        color: tokens.colors.accent.DEFAULT,
                        letterSpacing: '0.05em',
                        fontWeight: 900
                    }}>YOUR RATION</h2>
                    <button
                        onClick={toggleCart}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: tokens.colors.surface.light }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '40px', color: tokens.colors.text.secondary }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>🍽️</div>
                            <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'white' }}>Your ration pack is empty.</p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Add some meals to get started!</p>
                            <button onClick={toggleCart} className="btn-black" style={{ marginTop: '20px' }}>
                                Start Adding Meals
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '16px',
                                        background: tokens.colors.surface.medium,
                                        borderRadius: tokens.radius.md,
                                        border: `1px solid ${tokens.colors.border.dark}`,
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        position: 'relative',
                                        width: '80px',
                                        height: '80px',
                                        flexShrink: 0,
                                        borderRadius: tokens.radius.md,
                                        overflow: 'hidden',
                                        border: `2px solid ${tokens.colors.border.dark}`
                                    }}>
                                        <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{item.title}</h4>
                                            <div style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT, fontSize: '1rem' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: tokens.colors.text.secondary, marginBottom: '12px' }}>{item.calories} kcal</p>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: `1px solid ${tokens.colors.border.dark}`,
                                                borderRadius: tokens.radius.sm,
                                                background: tokens.colors.surface.dark
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ padding: '0 12px', fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    color: tokens.colors.text.error,
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    borderRadius: tokens.radius.sm,
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{
                        padding: '24px',
                        borderTop: `2px solid ${tokens.colors.accent.DEFAULT}`,
                        background: tokens.colors.surface.medium
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: tokens.colors.text.secondary, fontSize: '1rem', fontWeight: 600 }}>Subtotal</span>
                            <span style={{ fontWeight: 800, color: 'white', fontSize: '1.25rem' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.secondary, marginBottom: '24px' }}>
                            Shipping and taxes calculated at checkout.
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="btn-black"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                width: '100%',
                                textDecoration: 'none',
                                padding: '16px',
                                fontSize: '1rem',
                                fontWeight: 800
                            }}
                        >
                            CHECKOUT NOW
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
