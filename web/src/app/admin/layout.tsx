"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, ShoppingBag, Truck, Users, Tag, DollarSign, UtensilsCrossed, Package, Home, Settings, ChefHat } from "lucide-react";
import { tokens } from "@/lib/design-tokens";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: tokens.colors.surface.dark,
            color: 'white',
            fontFamily: 'var(--font-body)',
            flexDirection: 'column'
        }}>
            {/* Mobile Header */}
            <header className="admin-mobile-header" style={{
                padding: '16px 24px',
                background: 'white',
                borderBottom: `1px solid ${tokens.colors.border.light}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '45px', height: '45px' }}>
                        <Image
                            src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                            fill
                            alt="LMP Logo"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <span style={{ color: 'black', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>ADMIN</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'black' }}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                {/* Sidebar */}
                <aside
                    className={`admin-siidebar ${isMobileMenuOpen ? 'open' : ''}`}
                    style={{
                        width: '260px',
                        background: '#FFFFFF',
                        borderRight: `1px solid ${tokens.colors.border.light}`,
                        padding: '32px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        overflowY: 'auto',
                        zIndex: 40,
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <Link href="/admin" style={{ textDecoration: 'none' }} className="desktop-only-logo">
                        <div style={{
                            fontWeight: 900,
                            fontSize: '1.5rem',
                            marginBottom: '48px',
                            letterSpacing: '-0.02em',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '45px', height: '45px', flexShrink: 0, overflow: 'visible' }}>
                                <Image
                                    src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                                    fill
                                    alt="LMP Logo"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>LMP</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
                            </div>
                        </div>
                    </Link>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <NavItem href="/admin" active={pathname === '/admin'} icon={<LayoutDashboard size={20} />}>Dashboard</NavItem>
                        <NavItem href="/admin/orders" active={pathname?.startsWith('/admin/orders')} icon={<ShoppingBag size={20} />}>Orders</NavItem>
                        <NavItem href="/admin/kitchen" active={pathname === '/admin/kitchen'} icon={<ChefHat size={20} />}>Kitchen</NavItem>
                        <NavItem href="/admin/deliveries" active={pathname?.startsWith('/admin/deliveries')} icon={<Truck size={20} />}>Deliveries</NavItem>
                        <NavItem href="/admin/meals" active={pathname?.startsWith('/admin/meals')} icon={<UtensilsCrossed size={20} />}>Meals</NavItem>
                        <NavItem href="/admin/inventory" active={pathname === '/admin/inventory'} icon={<Package size={20} />}>Inventory</NavItem>
                        <NavItem href="/admin/employees" active={pathname === '/admin/employees'} icon={<Users size={20} />}>Employees</NavItem>
                        <NavItem href="/admin/customers" active={pathname === '/admin/customers'} icon={<Users size={20} />}>Customers</NavItem>
                        <NavItem href="/admin/promo-codes" active={pathname === '/admin/promo-codes'} icon={<Tag size={20} />}>Promo Codes</NavItem>
                        <NavItem href="/admin/finances" active={pathname === '/admin/finances'} icon={<DollarSign size={20} />}>Finances</NavItem>
                        <div style={{ height: '1px', background: tokens.colors.border.light, margin: '12px 0' }}></div>
                        <NavItem href="/admin/settings" active={pathname === '/admin/settings'} icon={<Settings size={20} />}>Settings</NavItem>
                    </nav>

                    <div style={{ flex: 1 }}></div>

                    <div style={{ paddingTop: '24px', borderTop: `1px solid ${tokens.colors.border.light}`, marginTop: '24px' }}>
                        <NavItem href="/" icon={<Home size={20} />}>Back to Site</NavItem>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    padding: '24px', // Reduced padding for mobile by default, query can increase it
                    background: tokens.colors.surface.dark,
                    minHeight: '100vh',
                    width: '100%',
                    overflowX: 'hidden'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                /* Desktop default */
                .admin-mobile-header { display: none !important; }
                
                @media (max-width: 1024px) {
                    .admin-mobile-header { display: flex !important; }
                    
                    aside {
                        position: fixed !important;
                        top: 65px !important; /* Header height offset */
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                        width: 100% !important; /* Full width on mobile */
                        max-width: 300px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    }
                    
                    aside.open {
                        transform: translateX(0);
                    }

                    .desktop-only-logo {
                        display: none;
                    }
                }
            `}</style>
        </div >
    )
}

function NavItem({ children, active = false, href, icon }: { children: React.ReactNode, active?: boolean, href: string, icon?: React.ReactNode }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                padding: '12px 16px',
                borderRadius: tokens.radius.md,
                cursor: 'pointer',
                color: active ? '#000000' : tokens.colors.text.secondary,
                background: active ? '#f8fafc' : 'transparent',
                fontWeight: active ? 700 : 500,
                fontSize: '0.95rem',
                transition: tokens.transitions.fast,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'var(--font-body)',
                borderLeft: active ? `4px solid ${tokens.colors.primary.DEFAULT}` : '4px solid transparent',
                marginLeft: active ? '-4px' : '0'
            }}
                onMouseOver={(e) => {
                    if (!active) {
                        e.currentTarget.style.color = tokens.colors.text.primary;
                        e.currentTarget.style.background = '#f8fafc';
                    }
                }}
                onMouseOut={(e) => {
                    if (!active) {
                        e.currentTarget.style.color = tokens.colors.text.secondary;
                        e.currentTarget.style.background = 'transparent';
                    }
                }}
            >
                {icon && <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>}
                {children}
            </div>
        </Link>
    )
}


