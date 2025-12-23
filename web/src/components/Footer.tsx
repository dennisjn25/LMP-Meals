"use client";

import Image from "next/image";

export default function Footer() {
    return (
        <footer style={{ background: '#000', color: '#fff', padding: '80px 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div className="logo-shimmer-wrapper" style={{ width: '40px', height: '40px' }}>
                                <Image
                                    src="/logo.png"
                                    width={40}
                                    height={40}
                                    alt="LMP Logo"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>Liberty Meal Prep</span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                            Fresh, healthy meals prepared daily for your convenience.
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                            ★ Veteran Owned • Since 2023
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '0.9rem' }}>QUICK LINKS</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><a href="/menu" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Menu</a></li>
                            <li><a href="/story" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Our Story</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '0.9rem' }}>SUPPORT</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Contact Us</a></li>
                            <li><a href="/how-it-works" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Delivery Info</a></li>
                            <li><a href="/nutrition" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Nutrition Info</a></li>
                            <li><a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Privacy Policy</a></li>
                            <li><a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '0.9rem' }}>CONNECT</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><a href="https://www.instagram.com/liberty_meal_prep_llc/" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>Instagram</a></li>
                            <li><a href="https://www.tiktok.com/@liberty.meal.prep" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>TikTok</a></li>

                        </ul>
                        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#6b7280' }}>
                            Serving Greater Phoenix, AZ<br />
                            Sunday Deliveries • 25 mile radius
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
