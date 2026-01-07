"use client";

import Image from "next/image";
import Link from "next/link";
import { Hammer, ShieldAlert, Lock } from "lucide-react";
import { tokens } from "@/lib/design-tokens";

export default function UnderConstruction() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#0f172a', // Slate 900
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
            backgroundImage: `
                radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%),
                linear-gradient(rgba(0,0,0,0.5) 2px, transparent 2px), 
                linear-gradient(90deg, rgba(0,0,0,0.5) 2px, transparent 2px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            backgroundPosition: 'center, 0 0, 0 0'
        }}>
            {/* Logo/Badge */}
            <div style={{
                marginBottom: '40px',
                position: 'relative',
                animation: 'float 6s ease-in-out infinite'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    background: tokens.colors.accent.DEFAULT,
                    borderRadius: '50%',
                    opacity: 0.1,
                    filter: 'blur(20px)'
                }}></div>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#1e293b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `4px solid ${tokens.colors.accent.DEFAULT}`,
                    boxShadow: `0 0 30px ${tokens.colors.accent.DEFAULT}40`
                }}>
                    <Hammer size={48} color={tokens.colors.accent.DEFAULT} />
                </div>
            </div>

            {/* Content */}
            <div style={{ textAlign: 'center', maxWidth: '600px', zIndex: 10 }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(234, 179, 8, 0.1)',
                    color: '#eab308',
                    padding: '6px 12px',
                    borderRadius: '99px',
                    marginBottom: '24px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(234, 179, 8, 0.2)'
                }}>
                    <ShieldAlert size={16} />
                    Site Maintenance
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Mission <br /> Paused
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    marginBottom: '48px',
                    fontWeight: 300
                }}>
                    We are currently upgrading our digital mess hall to serve you better.
                    Deployments will resume shortly. Stand by for further instructions.
                </p>

                {/* Status Indicators */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '48px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px', letterSpacing: '0.05em' }}>Status</div>
                        <div style={{ color: '#ef4444', fontWeight: 700 }}>OFFLINE</div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px', letterSpacing: '0.05em' }}>Estimated Return</div>
                        <div style={{ color: 'white', fontWeight: 700 }}>TBD</div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px', letterSpacing: '0.05em' }}>Security</div>
                        <div style={{ color: '#10b981', fontWeight: 700 }}>ACTIVE</div>
                    </div>
                </div>

                {/* Admin Access Hint */}
                <Link href="/auth/signin" style={{
                    color: '#475569',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color 0.2s'
                }}>
                    <Lock size={14} />
                    Authorized Personnel Only
                </Link>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
