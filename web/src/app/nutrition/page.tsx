import { getFeaturedMeals } from "@/actions/meals";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import Image from "next/image";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function NutritionPage() {
    const meals = await getFeaturedMeals();

    return (
        <main style={{ minHeight: '100dvh', background: tokens.colors.background, color: tokens.colors.text.primary }}>
            <Navbar />

            {/* Hero Header */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: tokens.spacing.xxl }}>
                <AnimatedLogoBackground />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.85)', zIndex: 1 }}></div>

                <div className="container" style={{ paddingTop: 'calc(100px + env(safe-area-inset-top))', paddingBottom: tokens.spacing.xxl, position: 'relative', zIndex: 2 }}>
                    <header style={{ textAlign: 'center' }}>
                        <div className="logo-shimmer-wrapper" style={{ marginBottom: tokens.spacing.xl, display: 'inline-block' }}>
                            <Image
                                src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                                alt="Liberty Meal Prep Logo"
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: '3.5rem',
                            marginBottom: tokens.spacing.md,
                            color: tokens.colors.accent.DEFAULT,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            fontWeight: 900
                        }}>
                            Nutrition <span style={{ color: 'white' }}>Facts</span>
                        </h1>
                        <p style={{
                            color: tokens.colors.text.inverseSecondary,
                            fontSize: '1.2rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Detailed macronutrient breakdown for all our meals.
                        </p>
                    </header>
                </div>
            </div>

            <div className="container">
                <Card style={{
                    padding: 0,
                    overflow: 'hidden',
                    background: tokens.colors.surface.medium
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: `1px solid ${tokens.colors.border.dark}` }}>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: tokens.colors.accent.DEFAULT, letterSpacing: '0.05em' }}>MEAL</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: tokens.colors.accent.DEFAULT, textAlign: 'center', letterSpacing: '0.05em' }}>CALORIES</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: tokens.colors.accent.DEFAULT, textAlign: 'center', letterSpacing: '0.05em' }}>PROTEIN (g)</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: tokens.colors.accent.DEFAULT, textAlign: 'center', letterSpacing: '0.05em' }}>CARBS (g)</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: tokens.colors.accent.DEFAULT, textAlign: 'center', letterSpacing: '0.05em' }}>FAT (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meals.map((meal, index) => (
                                    <tr key={meal.id} style={{
                                        borderBottom: `1px solid ${tokens.colors.border.dark}`,
                                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                        transition: tokens.transitions.normal
                                    }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.lg }}>
                                                <div style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: tokens.radius.md,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    flexShrink: 0,
                                                    border: `1px solid ${tokens.colors.border.dark}`
                                                }}>
                                                    <Image
                                                        src={meal.image}
                                                        alt={meal.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                                        {meal.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: tokens.colors.text.inverseSecondary, marginTop: '4px' }}>
                                                        {meal.category} • {meal.tags.split(',')[0]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>
                                            {meal.calories}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>
                                            {meal.protein}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>
                                            {meal.carbs}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>
                                            {meal.fat}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div style={{ marginTop: tokens.spacing.xxl, textAlign: 'center', color: tokens.colors.text.secondary, fontSize: '0.9rem', fontStyle: 'italic' }}>
                    * Nutritional values are approximate and may vary slightly based on ingredients and portion sizes.
                </div>
            </div>

            <Footer />
        </main>
    );
}
