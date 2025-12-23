"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 2000,
                        backdropFilter: 'blur(2px)'
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
                background: '#fff',
                zIndex: 2001,
                transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>YOUR RATION</h2>
                    <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '40px', color: '#9ca3b8' }}>
                            <p>Your ration pack is empty.</p>
                            <button onClick={toggleCart} className="btn-black" style={{ marginTop: '20px' }}>
                                Start Adding Meals
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                                        <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</h4>
                                            <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>{item.calories} kcal</p>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ padding: '0 8px', fontSize: '0.9rem' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
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
                    <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Subtotal</span>
                            <span style={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>
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
                                padding: '16px'
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
