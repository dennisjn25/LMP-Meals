"use client";
// Force rebuild for LFS sync

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const pathname = usePathname();
    const { toggleCart, cartCount } = useCart();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
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
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
                        <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '45px', height: '45px', background: 'transparent', flexShrink: 0 }}>
                            <Image src="/logo.png" alt="Liberty" fill style={{ objectFit: 'contain', filter: 'brightness(1.2)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <span className="logo-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
                                Liberty Meal Prep
                            </span>
                            <span className="logo-sub" style={{ fontSize: '0.65rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Veteran Owned
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <div className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
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
                    <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

                    {/* Mobile Controls */}
                    <div className="mobile-controls" style={{ gap: '16px' }}>
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

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 1002 }}
                        >
                            {isMenuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
                        </button>
                    </div>

                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#0b0e14',
                    zIndex: 999,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Link href="/" className={`mobile-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            HOME
                        </Link>
                        <Link href="/menu" className={`mobile-link ${pathname === '/menu' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            MENU
                        </Link>
                        <Link href="/story" className={`mobile-link ${pathname === '/story' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            OUR STORY
                        </Link>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {session?.user ? (
                            <>
                                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    {(session.user.role === "ADMIN" ? "ADMIN DASHBOARD" : "DASHBOARD")}
                                </Link>
                                <button
                                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                                    className="btn-black"
                                    style={{ width: '100%', textAlign: 'center', background: '#fbbf24', color: '#000' }}
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    SIGN UP
                                </Link>
                                <Link href="/auth/login" className="btn-black" style={{ width: '100%', textAlign: 'center', background: '#fbbf24', color: '#000' }} onClick={() => setIsMenuOpen(false)}>
                                    LOGIN
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .desktop-nav, .desktop-actions {
                    display: flex;
                }
                .mobile-controls {
                    display: none;
                }

                @media (max-width: 900px) {
                    .desktop-nav, .desktop-actions {
                        display: none !important;
                    }
                    .mobile-controls {
                        display: flex !important;
                        align-items: center;
                    }
                    .logo-text {
                        font-size: 1rem !important;
                    }
                    .logo-sub {
                        font-size: 0.55rem !important;
                    }
                }

                .mobile-link {
                    display: block;
                    padding: 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                    color: #fff;
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    transition: all 0.2s;
                }
                .mobile-link.active {
                    background: rgba(251, 191, 36, 0.1);
                    border-color: rgba(251, 191, 36, 0.3);
                    color: #fbbf24;
                }
            `}</style>
        </>
    );
}
