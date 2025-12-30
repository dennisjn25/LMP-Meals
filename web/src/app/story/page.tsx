"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import { Heart, ShieldCheck, MapPin, Users, Medal } from "lucide-react";

export default function StoryPage() {
    return (
        <main style={{ minHeight: '100dvh', background: '#0B0E14', color: '#fff' }}>
            <Navbar />

            {/* HERO HERO */}
            <section style={{
                position: 'relative',
                minHeight: '60dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 'calc(120px + env(safe-area-inset-top))',
                marginBottom: '80px',
                overflow: 'hidden'
            }}>
                <AnimatedLogoBackground />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.85)', zIndex: 1 }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>

                    {/* Logo with Shimmer Effect */}
                    <div className="logo-shimmer-wrapper" style={{ marginBottom: '32px', display: 'inline-block', position: 'relative' }}>
                        <Image
                            src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                            alt="Liberty Meal Prep Logo"
                            width={140}
                            height={140}
                            style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                        />
                    </div>
                    <br />

                    <h1 style={{ fontSize: '4rem', marginBottom: '16px', textShadow: '0 4px 12px rgba(0,0,0,0.8)', color: '#fff', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>OUR STORY</h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 8px rgba(0,0,0,0.8)', color: '#ffffff' }}>
                        Born from a personal journey to health, Liberty Meal Prep brings you delicious, high-quality meals that nourish your body and soul.
                    </p>
                </div>
            </section>

            {/* CONTENT SPLIT */}
            <div className="container" style={{ paddingBottom: '100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'start' }}>

                    {/* Left: Photo */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'relative',
                            height: '600px',
                            width: '100%',
                            background: '#1E293B',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                        }}>
                            <Image
                                src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/justin_dowd_final.jpg"
                                alt="Justin Dowd - Founder"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                            />
                        </div>
                        {/* Name Tag */}
                        <div style={{
                            position: 'absolute',
                            bottom: '24px',
                            left: '24px',
                            background: 'rgba(11, 14, 20, 0.9)',
                            backdropFilter: 'blur(12px)',
                            padding: '16px 24px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>Justin Dowd</div>
                            <div style={{ fontSize: '0.9rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Founder</div>
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div style={{ paddingTop: '20px' }}>
                        <div style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            color: '#fbbf24',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            marginBottom: '32px',
                            border: '1px solid rgba(251, 191, 36, 0.2)'
                        }}>
                            <Medal size={16} />
                            VETERAN OWNED
                        </div>

                        <h2 style={{ fontSize: '3rem', marginBottom: '32px', lineHeight: 1.1, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                            A Journey of Health<br />& <span style={{ color: '#fbbf24' }}>Service</span>
                        </h2>

                        <div style={{ color: '#ffffff', fontSize: '1.1rem', lineHeight: 1.8 }}>
                            <p style={{ marginBottom: '24px', color: '#fff' }}>
                                Liberty Meal Prep was founded by <strong>Justin Dowd</strong>, based in Scottsdale, Arizona. Years ago, Justin faced a personal health challenge that would change his life forever.
                            </p>
                            <p style={{ marginBottom: '24px', color: '#fff' }}>
                                Diagnosed with <strong>celiac disease</strong>, Justin discovered that traditional meal options weren't meeting his nutritional needs. Determined to take control of his health, he began meal prepping with fresh, gluten-free ingredients, focusing on quality, nutrition, and flavor.
                            </p>
                            <p style={{ marginBottom: '24px', color: '#fff' }}>
                                What started as a personal solution became a mission: to bring delicious, high-quality, mouth-watering, healthy meals to everyday lives. Justin understood that everyone deserves access to nutritious food that doesn't compromise on taste or convenience.
                            </p>
                            <blockquote style={{
                                borderLeft: '4px solid #fbbf24',
                                background: 'rgba(251, 191, 36, 0.1)',
                                padding: '24px',
                                margin: '32px 0',
                                borderRadius: '0 12px 12px 0',
                                fontStyle: 'italic',
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '1.2rem'
                            }}>
                                "Our goal is simple: to make healthy eating accessible, delicious, and convenient for everyone."
                            </blockquote>
                        </div>
                    </div>

                </div>
            </div>

            {/* MISSION ICONS STRIP */}
            <div style={{ background: '#0F172A', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)' }}>OUR COMMITMENT</h2>
                    <p style={{ color: '#ffffff', marginBottom: '80px', fontSize: '1.2rem', maxWidth: '600px', marginInline: 'auto' }}>To bring delicious, high-quality, mouth-watering, healthy meals to your everyday life</p>
                    <br /><br />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
                        <MissionCard icon={<Heart size={32} color="#fbbf24" />} title="Quality First" text="We use only the finest, freshest ingredients in every meal we prepare" />
                        <MissionCard icon={<ShieldCheck size={32} color="#fbbf24" />} title="Health Focused" text="Every meal is crafted with nutrition and wellness in mind" />
                        <MissionCard icon={<Medal size={32} color="#fbbf24" />} title="Veteran Owned" text="Proudly serving our community with dedication and integrity" />
                        <MissionCard icon={<Users size={32} color="#fbbf24" />} title="Community Driven" text="Building a healthier community, one meal at a time" />
                    </div>
                </div>
            </div>

            {/* Understanding Dietary Needs */}
            <div className="container" style={{ padding: '100px 0', maxWidth: '900px' }}>
                <div style={{
                    background: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '60px',
                    textAlign: 'center',
                    borderRadius: '32px',
                    boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)' }}>Understanding Dietary Needs</h2>
                    <p style={{ color: '#f1f5f9', marginBottom: '40px', fontStyle: 'italic', fontSize: '1.1rem' }}>
                        Our commitment to health extends beyond our founder's personal journey
                    </p>

                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '40px',
                        borderLeft: '4px solid #fbbf24',
                        textAlign: 'left',
                        borderRadius: '0 16px 16px 0'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#fff', fontFamily: 'var(--font-heading)' }}>Celiac Disease Awareness</h3>
                        <p style={{ marginBottom: '20px', color: '#ffffff', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            Having experienced celiac disease firsthand, Justin understands the importance of safe, gluten-free meal options. While not all our meals are gluten-free, we offer a wide variety of options and clearly label all allergens to help you make informed choices.
                        </p>
                        <p style={{ marginBottom: '20px', color: '#ffffff', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            At Liberty Meal Prep, we believe that dietary restrictions shouldn't mean sacrificing flavor or quality. Our team carefully prepares each meal with attention to ingredient sourcing, cross-contamination prevention, and nutritional balance.
                        </p>
                        <p style={{ color: '#ffffff', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            Whether you're managing celiac disease, following a specific diet, or simply looking for healthier meal options, we're here to support your journey to better health through delicious, nutritious food.
                        </p>
                    </div>
                </div>
            </div>

            {/* Serving Scottsdale (Dark Section) */}
            <div style={{ background: '#000', color: '#fff', padding: '100px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    zIndex: 0
                }}></div>
                <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '24px', color: '#fff', fontFamily: 'var(--font-heading)' }}>Serving Greater Phoenix, Arizona</h2>
                    <p style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '60px' }}>
                        Based in the heart of Scottsdale, we're proud to serve our local community with fresh, healthy meals delivered right to your door.
                    </p>
                    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ color: '#fbbf24', marginBottom: '8px' }}><MapPin size={24} /></div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>Sunday Deliveries</div>
                            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Within 25 miles of Scottsdale</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ color: '#fbbf24', marginBottom: '8px' }}><ShieldCheck size={24} /></div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>Fresh Daily</div>
                            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Prepared with care</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ color: '#fbbf24', marginBottom: '8px' }}><Medal size={24} /></div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>Veteran Owned</div>
                            <div style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>Since 2023</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ready to Start CTA */}
            <div className="container" style={{ padding: '100px 0' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    padding: '80px 20px',
                    textAlign: 'center',
                    borderRadius: '32px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 0 50px rgba(251, 191, 36, 0.1)'
                }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                        <span className="shimmer-text" data-text="Ready to Start Your Journey?">
                            Ready to Start Your Journey?
                        </span>
                    </h2>
                    <p style={{ color: '#ffffff', maxWidth: '600px', margin: '0 auto 40px auto', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Join us in making healthy eating delicious, convenient, and accessible. Browse our menu and discover meals that nourish your body and delight your taste buds.
                    </p>
                    <a href="/menu" style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        padding: '20px 48px',
                        fontSize: '1.1rem',
                        background: '#fbbf24',
                        color: '#000',
                        fontWeight: 800,
                        borderRadius: '50px',
                        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
                        transition: 'transform 0.2s',
                        border: '2px solid #fbbf24'
                    }}>
                        EXPLORE OUR MENU →
                    </a>
                </div>
            </div>



            <Footer />
        </main>
    );
}

function MissionCard({ icon, title, text }: any) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '40px 32px',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            transition: 'transform 0.3s, background 0.3s',
            height: '100%'
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
            }}
        >
            <div style={{ marginBottom: '24px', display: 'inline-block', padding: '16px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)' }}>{title}</h3>
            <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.6 }}>{text}</p>
        </div>
    )
}
