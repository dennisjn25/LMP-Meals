"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const pathname = usePathname();
    const { toggleCart, cartCount } = useCart();
    const { data: session } = useSession();

    return (
        <nav style={{
            background: 'rgba(11, 14, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            height: '80px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

                {/* Left: Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '50px', height: '50px', background: 'transparent', flexShrink: 0 }}>
                        <Image src="/logo.png" alt="Liberty" fill style={{ objectFit: 'contain', filter: 'brightness(1.2)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#fff' }}>
                            Liberty Meal Prep
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Veteran Owned
                        </span>
                    </div>
                </Link>

                {/* Center: Navigation Pills */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href="/" className={`nav-btn ${pathname === '/' ? 'active' : ''}`}>
                        <span>🏠</span> HOME
                    </Link>
                    <Link href="/menu" className={`nav-btn ${pathname === '/menu' ? 'active' : ''}`}>
                        <span>📄</span> MENU
                    </Link>
                    <Link href="/story" className={`nav-btn ${pathname === '/story' ? 'active' : ''}`}>
                        <span>📖</span> OUR STORY
                    </Link>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={toggleCart}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', position: 'relative' }}
                    >
                        <ShoppingCart size={24} color="#fff" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                background: '#fbbf24',
                                color: '#000',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {session?.user ? (
                        <>
                            <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="nav-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                                {(session.user.role === "ADMIN" ? "ADMIN" : "DASHBOARD")}
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="btn-black"
                                style={{ padding: '8px 24px', fontSize: '0.85rem', background: '#fbbf24', color: '#000', border: 'none' }}
                            >
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/register" className="nav-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                                SIGN UP
                            </Link>
                            <Link href="/auth/login" className="btn-black" style={{ padding: '8px 24px', fontSize: '0.85rem', background: '#fbbf24', color: '#000', border: 'none' }}
                                onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 15px rgba(251, 191, 36, 0.4)' }}
                                onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                            >
                                LOGIN
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}
