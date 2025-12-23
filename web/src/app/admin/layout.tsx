"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#0B0E14',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#FFFFFF',
                borderRight: '1px solid #e5e7eb',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto',
                zIndex: 100
            }}>
                <Link href="/admin" style={{ textDecoration: 'none' }}>
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
                        <div className="logo-shimmer-wrapper" style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0, borderRadius: '50%', overflow: 'visible' }}>
                            <Image
                                src="/logo.png"
                                fill
                                alt="LMP Logo"
                                style={{ objectFit: 'contain', padding: '2px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>LMP</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
                        </div>
                    </div>
                </Link>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <NavItem href="/admin" active={pathname === '/admin'}>Dashboard</NavItem>
                    <NavItem href="/admin/orders" active={pathname === '/admin/orders'}>Orders</NavItem>
                    <NavItem href="/admin/deliveries" active={pathname?.startsWith('/admin/deliveries')}>Deliveries</NavItem>
                    <NavItem href="/admin/inventory" active={pathname === '/admin/inventory'}>Inventory</NavItem>
                    <NavItem href="/admin/employees" active={pathname === '/admin/employees'}>Employees</NavItem>
                    <NavItem href="/admin/customers" active={pathname === '/admin/customers'}>Customers</NavItem>
                    <NavItem href="/admin/promo-codes" active={pathname === '/admin/promo-codes'}>Promo Codes</NavItem>
                    <NavItem href="/admin/finances" active={pathname === '/admin/finances'}>Finances</NavItem>
                </nav>



                <div style={{ flex: 1 }}></div>

                <div style={{ paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                    <NavItem href="/admin/meals" active={pathname === '/admin/meals'}>Manage Meals</NavItem>
                    <NavItem href="/">Back to Site</NavItem>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '48px',
                background: '#0B0E14',
                minHeight: '100vh',
                marginLeft: '260px',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div >
    )
}

function NavItem({ children, active = false, href }: { children: React.ReactNode, active?: boolean, href: string }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: active ? '#000000' : '#64748b',
                background: active ? '#f8fafc' : 'transparent',
                fontWeight: active ? 700 : 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-body)',
                borderLeft: active ? '4px solid #000000' : '4px solid transparent',
                marginLeft: active ? '-4px' : '0'
            }}
                onMouseOver={(e) => {
                    if (!active) {
                        e.currentTarget.style.color = '#000000';
                        e.currentTarget.style.background = '#f8fafc';
                    }
                }}
                onMouseOut={(e) => {
                    if (!active) {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.background = 'transparent';
                    }
                }}
            >
                {children}
            </div>
        </Link>
    )
}

