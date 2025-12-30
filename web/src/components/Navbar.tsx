"use client";
// Force rebuild for LFS sync

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Home, FileText, BookOpen } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { tokens } from "@/lib/design-tokens";
import { getSystemSetting } from "@/actions/settings";

export default function Navbar() {
    const pathname = usePathname();
    const { toggleCart, cartCount } = useCart();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [bannerData, setBannerData] = useState<{ text: string; enabled: boolean } | null>({
        text: "Weekly deliveries beginning January 18th. Get your orders locked in today!",
        enabled: true
    });

    useEffect(() => {
        async function fetchBanner() {
            try {
                const setting = await getSystemSetting("announcement_banner");
                if (setting) {
                    setBannerData({
                        text: setting.value.text || "",
                        enabled: setting.isEnabled
                    });
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
            }
        }
        fetchBanner();
    }, []);

    useEffect(() => {
        const height = (bannerData?.enabled) ? '120px' : '80px';
        document.documentElement.style.setProperty('--header-height', height);
    }, [bannerData?.enabled]);

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {bannerData?.enabled && (
                <div style={{
                    background: tokens.colors.accent.DEFAULT,
                    color: '#000',
                    padding: '8px 24px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                    paddingTop: 'calc(8px + env(safe-area-inset-top))',
                    width: '100%',
                }}>
                    {bannerData.text}
                </div>
            )}
            <nav style={{
                background: tokens.colors.surface.dark, // Keep dark for nav
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${tokens.colors.border.dark}`,
                height: '80px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingTop: bannerData?.enabled ? '0' : 'env(safe-area-inset-top)' // Add padding if banner is missing
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Left: Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
                        <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '45px', height: '45px', background: 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png" alt="Liberty" fill style={{ objectFit: 'contain', filter: 'brightness(1.2)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <span className="logo-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
                                Liberty Meal Prep
                            </span>
                            <span className="logo-sub" style={{ fontSize: '0.65rem', color: tokens.colors.accent.DEFAULT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Veteran Owned
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <div className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
                        <NavLink href="/" active={pathname === '/'} icon={<Home size={16} />}>HOME</NavLink>
                        <NavLink href="/menu" active={pathname === '/menu'} icon={<FileText size={16} />}>MENU</NavLink>
                        <NavLink href="/story" active={pathname === '/story'} icon={<BookOpen size={16} />}>OUR STORY</NavLink>
                    </div>

                    {/* Right: Actions */}
                    <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={toggleCart}
                            aria-label="Open cart"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', position: 'relative' }}
                        >
                            <ShoppingCart size={24} color="#fff" />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    right: '-2px',
                                    background: tokens.colors.accent.DEFAULT,
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
                                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                                    <Button variant="ghost" size="sm" style={{ color: 'white', border: `1px solid ${tokens.colors.border.dark}` }}>
                                        {(session.user.role === "ADMIN" ? "ADMIN" : "DASHBOARD")}
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => signOut()}
                                    variant="secondary"
                                    size="sm"
                                >
                                    LOGOUT
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register">
                                    <Button variant="ghost" size="sm" style={{ color: 'white', border: `1px solid ${tokens.colors.border.dark}` }}>
                                        SIGN UP
                                    </Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button variant="secondary" size="sm">
                                        LOGIN
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="mobile-controls" style={{ gap: '16px' }}>
                        <button
                            onClick={toggleCart}
                            aria-label="Open cart"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', position: 'relative' }}
                        >
                            <ShoppingCart size={24} color="#fff" />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    right: '-2px',
                                    background: tokens.colors.accent.DEFAULT,
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
                            aria-label="Toggle menu"
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
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: tokens.colors.surface.dark,
                    zIndex: 999,
                    padding: '140px 24px 24px 24px', // 140px top padding to clear header + banner
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    overflowY: 'auto',
                    borderTop: `1px solid ${tokens.colors.border.dark}`
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <MobileLink href="/" active={pathname === '/'} onClick={() => setIsMenuOpen(false)}>HOME</MobileLink>
                        <MobileLink href="/menu" active={pathname === '/menu'} onClick={() => setIsMenuOpen(false)}>MENU</MobileLink>
                        <MobileLink href="/story" active={pathname === '/story'} onClick={() => setIsMenuOpen(false)}>OUR STORY</MobileLink>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {session?.user ? (
                            <>
                                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" fullWidth style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                        {(session.user.role === "ADMIN" ? "ADMIN DASHBOARD" : "DASHBOARD")}
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                                    variant="secondary"
                                    fullWidth
                                >
                                    LOGOUT
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" fullWidth style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                        SIGN UP
                                    </Button>
                                </Link>
                                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="secondary" fullWidth>
                                        LOGIN
                                    </Button>
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
            `}</style>
        </header>
    );
}

function NavLink({ href, active, children, icon }: { href: string, active: boolean, children: React.ReactNode, icon?: React.ReactNode }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: `1px solid ${active ? tokens.colors.accent.DEFAULT : 'rgba(255,255,255,0.1)'}`,
            background: active ? '#000' : 'rgba(0,0,0,0.5)',
            color: active ? tokens.colors.accent.DEFAULT : '#fff',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            borderRadius: tokens.radius.sm,
            textDecoration: 'none'
        }}>
            {icon && <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>}
            {children}
        </Link>
    )
}

function MobileLink({ href, active, children, onClick }: { href: string, active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} style={{
            display: 'block',
            padding: '16px',
            background: active ? tokens.colors.accent.light : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? tokens.colors.accent.DEFAULT : 'rgba(255,255,255,0.05)'}`,
            borderRadius: tokens.radius.md,
            color: active ? tokens.colors.accent.DEFAULT : '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            textDecoration: 'none'
        }}>
            {children}
        </Link>
    )
}
