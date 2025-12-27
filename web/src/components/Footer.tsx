"use client";

import Image from "next/image";
import { tokens } from "@/lib/design-tokens";
import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{ background: tokens.colors.surface.dark, color: 'white', padding: '80px 0', borderTop: `1px solid ${tokens.colors.border.dark}` }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: tokens.spacing.xxl }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg }}>
                            <div className="logo-shimmer-wrapper" style={{ width: '40px', height: '40px', position: 'relative' }}>
                                <Image
                                    src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                                    fill
                                    alt="LMP Logo"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>Liberty Meal Prep</span>
                        </div>
                        <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: tokens.spacing.lg }}>
                            Fresh, healthy meals prepared daily for your convenience.
                        </p>
                        <div style={{ fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>
                            ★ Veteran Owned • Since 2023
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: tokens.spacing.lg, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>QUICK LINKS</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: tokens.colors.text.inverseSecondary, fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><FooterLink href="/menu">Menu</FooterLink></li>
                            <li><FooterLink href="/story">Our Story</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: tokens.spacing.lg, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>SUPPORT</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: tokens.colors.text.inverseSecondary, fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><FooterLink href="/contact">Contact Us</FooterLink></li>
                            <li><FooterLink href="/how-it-works">Delivery Info</FooterLink></li>
                            <li><FooterLink href="/nutrition">Nutrition Info</FooterLink></li>
                            <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: tokens.spacing.lg, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>CONNECT</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: tokens.colors.text.inverseSecondary, fontSize: '0.9rem', lineHeight: 2 }}>
                            <li><a href="https://www.instagram.com/liberty_meal_prep_llc/" target="_blank" rel="noopener noreferrer" style={{ color: tokens.colors.text.inverseSecondary, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT} onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.text.inverseSecondary}>Instagram</a></li>
                            <li><a href="https://www.tiktok.com/@liberty.meal.prep" target="_blank" rel="noopener noreferrer" style={{ color: tokens.colors.text.inverseSecondary, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT} onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.text.inverseSecondary}>TikTok</a></li>

                        </ul>
                        <div style={{ marginTop: tokens.spacing.lg, fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>
                            Serving Greater Phoenix, AZ<br />
                            Sunday Deliveries • 25 mile radius
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            style={{ color: tokens.colors.text.inverseSecondary, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT}
            onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.text.inverseSecondary}
        >
            {children}
        </Link>
    )
}
