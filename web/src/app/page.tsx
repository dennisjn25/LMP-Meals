"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, Truck, Award, CheckCircle, Star, TrendingUp, MapPin, Users, Zap, Instagram, Shield, Music } from "lucide-react";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import ParticleBackground from "@/components/effects/ParticleBackground";
import RewardsTracker from "@/components/gamification/RewardsTracker";
import FeaturedMealsCarousel from "@/components/FeaturedMealsCarousel";
import { tokens } from "@/lib/design-tokens";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main style={{ background: tokens.colors.background }}>
      <Navbar />
      <RewardsTracker />

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100dvh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 'calc(80px + env(safe-area-inset-top))'
      }}>
        {/* Animated Logo Background */}
        <AnimatedLogoBackground />
        <ParticleBackground density={40} colors={['rgba(255,255,255,0.3)', 'rgba(229,231,235,0.2)']} />

        {/* Dark Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>

          {/* Logo with Shimmer Effect */}
          <div className="logo-shimmer-wrapper" style={{ marginBottom: tokens.spacing.xl, display: 'inline-block', position: 'relative' }}>
            <Image
              src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
              alt="Liberty Meal Prep Logo"
              width={180}
              height={180}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
            />
          </div>
          <br />

          {/* Enhanced VETERAN OWNED Badge */}
          <div className="veteran-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%)',
            padding: '14px 28px',
            borderRadius: tokens.radius.full,
            marginBottom: tokens.spacing.lg,
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 4px 20px rgba(0,0,0,0.3)',
            animation: 'pulse-border 2s ease-in-out infinite',
            position: 'relative'
          }}>
            <Shield size={24} color="#fff" strokeWidth={2.5} />
            <span style={{ color: '#fff' }}>VETERAN OWNED & OPERATED</span>
            <span style={{ color: '#FCD34D', fontSize: '1.3rem' }}>★</span>
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: tokens.colors.text.inverseSecondary,
            marginBottom: tokens.spacing.lg,
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            Proudly Serving Since 2023
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            lineHeight: 1.1,
            marginBottom: tokens.spacing.lg,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            color: 'white',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            FRESH, HEALTHY MEALS<br />
            DELIVERED DAILY
          </h1>

          <p style={{
            fontSize: '1.25rem',
            maxWidth: '700px',
            margin: `0 auto ${tokens.spacing.xxl} auto`,
            color: tokens.colors.text.inverseSecondary,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
          }}>
            Mouth-watering, high-quality meals prepared fresh daily. Experience the perfect blend of nutrition, flavor, and convenience.
          </p>

          {/* Menu Rotation Notice */}
          <div
            className="menu-update-badge"
            style={{
              display: 'inline-block',
              background: 'rgba(251, 191, 36, 0.15)',
              border: `2px solid ${tokens.colors.accent.light}`,
              borderRadius: tokens.radius.lg,
              padding: '12px 24px',
              marginBottom: tokens.spacing.md,
              animation: 'fadeInUp 0.8s ease-out 0.3s backwards, cool-fade 3s ease-in-out infinite'
            }}
          >
            <span style={{
              color: tokens.colors.accent.DEFAULT,
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.sm
            }}>
              <TrendingUp size={18} />
              Menu Updates Every Thursday at 1AM
            </span>
          </div>

          <br />

          {/* Delivery Pickup Locations Notice */}
          <div
            className="pickup-notice-badge"
            style={{
              display: 'inline-block',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              borderRadius: tokens.radius.lg,
              padding: '12px 24px',
              marginBottom: tokens.spacing.xl,
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
            }}
          >
            <span style={{
              color: tokens.colors.text.success,
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.sm
            }}>
              <MapPin size={18} />
              Delivery Pick-Up Locations Available Soon
            </span>
          </div>

          <div style={{ display: 'flex', gap: tokens.spacing.md, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}>
            <Link href="/menu">
              <Button size="lg" variant="primary">
                Browse Our Menu →
              </Button>
            </Link>
            <Link href="/story">
              <Button size="lg" variant="ghost" style={{ color: 'white', border: '2px solid rgba(255,255,255,0.2)' }}>
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '100px 0', background: tokens.colors.background, position: 'relative' }}>
        <div className="container">
          <h2 className="section-title" style={{ animation: 'fadeInUp 0.6s ease-out', color: tokens.colors.text.primary, fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: tokens.spacing.sm }}>WHY CHOOSE LIBERTY MEAL PREP?</h2>
          <p className="section-subtitle" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards', color: tokens.colors.text.secondary, textAlign: 'center', marginBottom: tokens.spacing.xxl }}>Experience the difference quality makes</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

            <FeatureCard
              icon={<Clock size={32} color="white" />}
              title="FRESH DAILY"
              text="All meals are prepared fresh daily with premium, locally-sourced ingredients. No preservatives, no compromises."
              delay={0.2}
            />

            <FeatureCard
              icon={<Heart size={32} color="white" />}
              title="NUTRITIONAL BALANCE"
              text="Every meal is carefully crafted with optimal nutrition in mind. Perfect macros, vitamins, and minerals for your wellness journey."
              delay={0.3}
            />

            <FeatureCard
              icon={<Truck size={32} color="white" />}
              title="CONVENIENT DELIVERY"
              text="Fast, reliable Sunday delivery within 25 miles of Scottsdale. Your meals arrive fresh and ready to enjoy."
              delay={0.4}
            />

          </div>
        </div>
      </section>

      {/* MEAL SHOWCASE SECTION */}
      <section style={{
        padding: '100px 0',
        background: `linear-gradient(135deg, ${tokens.colors.background} 0%, #e5e7eb 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <h2 className="section-title" style={{ color: tokens.colors.text.primary, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800 }}>CRAFTED WITH CARE</h2>
          <p className="section-subtitle" style={{ color: tokens.colors.text.secondary, textAlign: 'center', marginBottom: tokens.spacing.xxl }}>Every meal is a masterpiece of flavor and nutrition</p>

          <div style={{
            minHeight: '400px', // Prevent layout shift while loading
            marginTop: '60px'
          }}>
            <FeaturedMealsCarousel />
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link href="/menu">
              <Button size="lg" variant="primary">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PREP DAY BEHIND-THE-SCENES SECTION */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ParticleBackground density={25} colors={['rgba(251,191,36,0.2)', 'rgba(255,255,255,0.1)']} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{ color: 'white', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800 }}>PREP DAY: BEHIND THE SCENES</h2>
          <p className="section-subtitle" style={{ color: tokens.colors.text.inverseSecondary, textAlign: 'center', marginBottom: tokens.spacing.xxl }}>See the care and precision that goes into every meal</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            marginTop: '60px'
          }}>
            <PrepDayCard
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-1.png"
              title="Fresh Preparation"
              description="Every meal is prepared fresh daily by our experienced culinary team using premium ingredients."
            />
            <PrepDayCard
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/healthy-lifestyle.png"
              title="Precision Portioning"
              description="Each meal is carefully portioned to meet exact nutritional specifications for your health goals."
            />
            <PrepDayCard
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-2.png"
              title="Quality Ingredients"
              description="We source only the finest, locally-sourced ingredients to ensure maximum freshness and nutrition."
            />
          </div>

          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: tokens.colors.accent.light,
            borderRadius: tokens.radius.xl,
            border: `2px solid ${tokens.colors.accent.light}`,
            textAlign: 'center'
          }}>
            <h3 className="text-outline-glow" style={{ fontSize: '1.8rem', marginBottom: tokens.spacing.md, fontFamily: 'var(--font-heading)', color: 'white' }}>
              Veteran-Owned Excellence
            </h3>
            <p style={{ fontSize: '1.1rem', color: tokens.colors.text.inverseSecondary, maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
              As a veteran-owned business, we bring unwavering precision and dedication to every meal we prepare.
              Our commitment to quality, discipline, and service excellence ensures you receive the best meal prep experience possible.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section style={{ padding: '100px 0', background: tokens.colors.background }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="section-title text-outline-glow" style={{ color: tokens.colors.text.primary, fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800 }}>FOLLOW OUR JOURNEY</h2>
            <p className="section-subtitle" style={{ color: tokens.colors.text.secondary }}>Join our community on social media for daily meal inspiration, behind-the-scenes content, and exclusive offers</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}>
            <InstagramPost
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-3.png"
              likes="234"
              caption="Protein-packed perfection 💪"
            />
            <InstagramPost
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-4.png"
              likes="189"
              caption="Keto made delicious 🥑"
            />
            <InstagramPost
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-5.png"
              likes="312"
              caption="Balanced nutrition, incredible taste ✨"
            />
            <InstagramPost
              image="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/prep-6.png"
              likes="445"
              caption="Fresh prep day vibes 👨‍🍳"
            />
          </div>

          {/* Social Media Follow Buttons */}
          <div style={{
            display: 'flex',
            gap: tokens.spacing.lg,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <a
              href="https://www.instagram.com/liberty_meal_prep_llc/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1rem',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                color: 'white',
                borderRadius: tokens.radius.full,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(228, 64, 95, 0.3)',
                border: 'none',
                cursor: 'pointer'
              }}
              className="social-btn"
            >
              <Instagram size={22} />
              Follow on Instagram
            </a>
            <a
              href="https://www.tiktok.com/@liberty.meal.prep"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1rem',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                color: 'white',
                borderRadius: tokens.radius.full,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                border: '2px solid #00f2ea',
                cursor: 'pointer'
              }}
              className="social-btn"
            >
              <Music size={22} />
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{ padding: '100px 0', background: tokens.colors.background }}>
        <div className="container">
          <h2 className="section-title" style={{ color: tokens.colors.text.primary, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800 }}>WHAT OUR CUSTOMERS SAY</h2>
          <p className="section-subtitle" style={{ color: tokens.colors.text.secondary, textAlign: 'center', marginBottom: tokens.spacing.xxl }}>Join thousands of satisfied customers</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '60px'
          }}>
            <TestimonialCard
              name="Sarah M."
              role="Fitness Enthusiast"
              text="Liberty Meal Prep has transformed my nutrition game! The meals are delicious and perfectly portioned. I've never felt better!"
              rating={5}
            />
            <TestimonialCard
              name="Mike T."
              role="Busy Professional"
              text="As someone with a hectic schedule, these meals are a lifesaver. High quality, great taste, and so convenient!"
              rating={5}
            />
            <TestimonialCard
              name="Jessica R."
              role="Health Coach"
              text="I recommend Liberty Meal Prep to all my clients. The attention to nutrition and quality is outstanding!"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP */}
      <section style={{ padding: '60px 0', borderTop: `1px solid ${tokens.colors.border.light}`, background: tokens.colors.background }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px' }}>
            <SmallFeature icon={<Award />} title="VETERAN OWNED" sub="Since 2023" />
            <SmallFeature icon={<Heart />} title="HEALTH FOCUSED" sub="Nutritious Meals" />
            <SmallFeature icon={<CheckCircle />} title="FRESH DAILY" sub="Premium Quality" />
            <SmallFeature icon={<Truck />} title="EASY DELIVERY" sub="Sunday Service" />
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
          }
        }

        @keyframes cool-fade {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.95);
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          }
        }

        @media (max-width: 768px) {
          .veteran-badge {
            padding: 8px 16px !important;
            font-size: 0.8rem !important;
            gap: 8px !important;
            max-width: 90%;
          }
        }
      `}</style>

      <Footer />
    </main>
  );
}

function FeatureCard({ icon, title, text, delay }: { icon: any, title: string, text: string, delay: number }) {
  return (
    <div className="feature-card" style={{
      animation: `fadeInUp 0.6s ease-out ${delay}s backwards`,
      background: tokens.colors.surface.light,
      padding: '32px',
      borderRadius: tokens.radius.xl,
      boxShadow: tokens.shadows.md,
      textAlign: 'center'
    }}>
      <div className="icon-box" style={{
        background: 'black',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px auto'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: tokens.colors.text.secondary, fontSize: '0.95rem', lineHeight: '1.6' }}>{text}</p>
    </div>
  )
}

function SmallFeature({ icon, title, sub }: { icon: any, title: string, sub: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        marginBottom: '12px',
        background: 'black',
        color: 'white',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tokens.radius.sm
      }}>
        {icon}
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
      <div style={{ color: tokens.colors.text.secondary, fontSize: '0.8rem' }}>{sub}</div>
    </div>
  )
}

function TestimonialCard({ name, role, text, rating }: { name: string, role: string, text: string, rating: number }) {
  return (
    <div style={{
      background: tokens.colors.surface.light,
      padding: '30px',
      borderRadius: tokens.radius.lg,
      boxShadow: tokens.shadows.md,
      border: `1px solid ${tokens.colors.border.light}`,
      transition: tokens.transitions.normal,
      textAlign: 'center'
    }}
      className="testimonial-card"
    >
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', justifyContent: 'center' }}>
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={18} fill={tokens.colors.accent.DEFAULT} color={tokens.colors.accent.DEFAULT} />
        ))}
      </div>
      <p style={{ color: tokens.colors.text.secondary, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
        "{text}"
      </p>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: tokens.colors.text.primary }}>{name}</div>
        <div style={{ color: tokens.colors.text.secondary, fontSize: '0.85rem' }}>{role}</div>
      </div>
    </div>
  );
}

function PrepDayCard({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div style={{
      background: tokens.colors.surface.medium,
      borderRadius: tokens.radius.xl,
      overflow: 'hidden',
      border: `1px solid ${tokens.colors.border.dark}`,
      transition: tokens.transitions.normal,
      cursor: 'pointer'
    }}
      className="prep-day-card"
    >
      <div style={{ position: 'relative', height: '250px', background: tokens.colors.surface.dark }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover', opacity: 0.9 }}
        />
      </div>
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontFamily: 'var(--font-heading)', color: tokens.colors.accent.DEFAULT }}>
          {title}
        </h3>
        <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '0.95rem', lineHeight: '1.6' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function InstagramPost({ image, likes, caption }: { image: string, likes: string, caption: string }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: tokens.radius.lg,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: tokens.transitions.normal,
      boxShadow: tokens.shadows.sm
    }}
      className="instagram-post"
    >
      <div style={{ position: 'relative', paddingBottom: '100%', background: tokens.colors.background }}>
        <Image
          src={image}
          alt={caption}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          padding: '40px 16px 16px 16px',
          color: 'white',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}
          className="instagram-overlay"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Heart size={18} fill="#E4405F" color="#E4405F" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{likes} likes</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{caption}</p>
        </div>
      </div>
    </div>
  );
}
