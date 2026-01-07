import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { Hammer, ShieldAlert, Lock, X, Loader2 } from "lucide-react";
import { tokens } from "@/lib/design-tokens";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export default function UnderConstruction() {
    const [showLogin, setShowLogin] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                } else if (data?.success && data?.redirect) {
                    window.location.href = data.redirect;
                }
            });
        });
    };

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
            <div
                onClick={() => setShowLogin(true)}
                style={{
                    marginBottom: '40px',
                    position: 'relative',
                    animation: 'float 6s ease-in-out infinite',
                    cursor: 'pointer'
                }}
            >
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
                    boxShadow: `0 0 30px ${tokens.colors.accent.DEFAULT}40`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 0 50px ${tokens.colors.accent.DEFAULT}60`;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 0 30px ${tokens.colors.accent.DEFAULT}40`;
                    }}
                >
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
                <button
                    onClick={() => setShowLogin(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#475569',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'color 0.2s',
                        cursor: 'pointer',
                        padding: 0
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT}
                    onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
                >
                    <Lock size={14} />
                    Authorized Personnel Only
                </button>
            </div>

            {/* Admin Login Modal */}
            {showLogin && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowLogin(false);
                    }}
                >
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        background: '#1e293b',
                        border: `1px solid ${tokens.colors.border.light}`,
                        borderRadius: tokens.radius.lg,
                        padding: '32px',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <button
                            onClick={() => setShowLogin(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(234, 179, 8, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                border: `1px solid rgba(234, 179, 8, 0.2)`
                            }}>
                                <Lock size={24} color={tokens.colors.accent.DEFAULT} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>ADMIN ACCESS</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Authenticate to access command center</p>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Input
                                label="Email"
                                type="email"
                                disabled={isPending}
                                placeholder="commander@lmp.com"
                                style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                                {...form.register("email")}
                            />

                            <Input
                                label="Password"
                                type="password"
                                disabled={isPending}
                                placeholder="••••••••"
                                style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                                {...form.register("password")}
                            />

                            {error && (
                                <div style={{
                                    padding: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    fontSize: '0.85rem',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                style={{
                                    background: tokens.colors.accent.DEFAULT,
                                    color: 'black',
                                    fontWeight: 700,
                                    marginTop: '8px'
                                }}
                            >
                                {isPending ? <Loader2 className="animate-spin" size={20} /> : "AUTHENTICATE"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
