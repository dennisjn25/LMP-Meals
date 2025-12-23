
import { getFeaturedMeals } from "@/actions/meals";
import Navbar from "@/components/Navbar";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function NutritionPage() {
    const meals = await getFeaturedMeals();

    return (
        <main style={{ minHeight: '100vh', paddingBottom: '80px', background: '#0B0E14', color: '#fff' }}>
            <Navbar />

            {/* Hero Header */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '60px' }}>
                <AnimatedLogoBackground />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.85)', zIndex: 1 }}></div>

                <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
                    <header style={{ textAlign: 'center' }}>
                        <div className="logo-shimmer-wrapper" style={{ marginBottom: '32px', display: 'inline-block' }}>
                            <Image
                                src="/logo.png"
                                alt="Liberty Meal Prep Logo"
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: '3.5rem',
                            marginBottom: '16px',
                            color: '#fbbf24',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}>
                            Nutrition <span style={{ color: '#fff' }}>Facts</span>
                        </h1>
                        <p style={{
                            color: '#94a3b8',
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
                <div style={{
                    background: '#1E293B',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fbbf24' }}>MEAL</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fbbf24', textAlign: 'center' }}>CALORIES</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fbbf24', textAlign: 'center' }}>PROTEIN (g)</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fbbf24', textAlign: 'center' }}>CARBS (g)</th>
                                    <th style={{ padding: '24px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fbbf24', textAlign: 'center' }}>FAT (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meals.map((meal, index) => (
                                    <tr key={meal.id} style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', position: 'relative', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <Image
                                                        src={meal.image}
                                                        alt={meal.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                                                        {meal.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
                                                        {meal.category} • {meal.tags.split(',')[0]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                                            {meal.calories}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: '#cbd5e1' }}>
                                            {meal.protein}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: '#cbd5e1' }}>
                                            {meal.carbs}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '1.1rem', color: '#cbd5e1' }}>
                                            {meal.fat}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    * Nutritional values are approximate and may vary slightly based on ingredients and portion sizes.
                </div>
            </div>
        </main>
    );
}
