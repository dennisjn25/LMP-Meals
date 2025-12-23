"use client";

import Navbar from "@/components/Navbar";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import { CheckCircle2, Clock, Truck, Utensils } from "lucide-react";

export default function HowItWorksPage() {
    return (
        <main style={{ minHeight: '100vh', paddingBottom: '80px', background: '#0B0E14', color: '#fff', position: 'relative' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <AnimatedLogoBackground />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 14, 20, 0.9)' }}></div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Navbar />

                <div className="container" style={{ paddingTop: '100px' }}>
                    <header style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', marginInline: 'auto' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
                            Simple Process • Serious Results
                        </span>
                        <h1 style={{ fontSize: '4rem', marginBottom: '24px', lineHeight: 1.1, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                            Streamlined for <br /><span style={{ color: '#fbbf24' }}>Peak Performance.</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                            We've simplified healthy eating so you can focus on crushing your goals. No cooking, no cleaning, just results.
                        </p>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        <StepCard
                            number="01"
                            title="Choose Your Fuel"
                            desc="Browse our rotating weekly menu. Select from High Protein, Keto, or Balanced macros to fit your training needs."
                            icon={<Utensils size={32} color="#fbbf24" />}
                        />
                        <StepCard
                            number="02"
                            title="We Cook Fresh"
                            desc="Our chefs prepare your meals from scratch right here in Scottsdale using premium ingredients. Never frozen."
                            icon={<CheckCircle2 size={32} color="#fbbf24" />}
                        />
                        <StepCard
                            number="03"
                            title="Sunday Delivery"
                            desc="We deliver directly to your door every Sunday between 8AM - 12PM so you're stocked for the week ahead."
                            icon={<Truck size={32} color="#fbbf24" />}
                        />
                        <StepCard
                            number="04"
                            title="Heat & Eat"
                            desc="Meals are ready in 2 minutes. Containers are microwave safe and BPA free. Eat, train, repeat."
                            icon={<Clock size={32} color="#fbbf24" />}
                        />
                    </div>

                    <div style={{
                        marginTop: '100px',
                        padding: '60px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#fff', textTransform: 'uppercase' }}>Ready to get started?</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '1.1rem' }}>Submit your order by 9PM Wednesday to receive your delivery this Sunday.</p>
                        <a href="/menu" style={{
                            display: 'inline-block',
                            padding: '16px 48px',
                            background: '#fbbf24',
                            color: '#000',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderRadius: '12px',
                            boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
                            transition: 'all 0.3s'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 0 50px rgba(251, 191, 36, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.3)';
                            }}
                        >
                            View Order Menu
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StepCard({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: any }) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s, background 0.3s',
            height: '100%'
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
            }}
        >
            <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                fontSize: '8rem',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.02)',
                lineHeight: 1,
                fontFamily: 'var(--font-heading)',
                pointerEvents: 'none'
            }}>
                {number}
            </div>

            <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
                {icon}
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#fff', fontFamily: 'var(--font-heading)' }}>{title}</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem' }}>{desc}</p>
        </div>
    )
}
