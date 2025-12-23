import { getFeaturedMeals } from "@/actions/meals";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedMealsSection() {
    const featuredMeals = await getFeaturedMeals();

    // If no featured meals, show default message
    if (featuredMeals.length === 0) {
        return (
            <section style={{
                padding: '100px 0',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e5e7eb 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container">
                    <h2 className="section-title">THIS WEEK'S MENU</h2>
                    <p className="section-subtitle">Check back soon for this week's featured meals!</p>
                </div>
            </section>
        );
    }

    return (
        <section style={{
            padding: '100px 0',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e5e7eb 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container">
                <h2 className="section-title">THIS WEEK'S MENU</h2>
                <p className="section-subtitle">Freshly prepared meals available for order this week</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px',
                    marginTop: '60px'
                }}>
                    {featuredMeals.map((meal, index) => (
                        <div key={meal.id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                            className="meal-showcase-card"
                        >
                            <div style={{ position: 'relative', height: '220px', background: '#f3f4f6' }}>
                                <Image
                                    src={meal.image}
                                    alt={meal.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    zIndex: 2,
                                    boxShadow: '0 2px 10px rgba(251, 191, 36, 0.4)'
                                }}>
                                    ${meal.price.toFixed(2)}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#fbbf24',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    zIndex: 2
                                }}>
                                    {meal.category}
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                                    {meal.title}
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '12px', lineHeight: '1.5' }}>
                                    {meal.description || 'Delicious and nutritious meal prepared fresh daily'}
                                </p>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                                    <span>{meal.calories} cal</span>
                                    <span>•</span>
                                    <span>{meal.protein}g protein</span>
                                    <span>•</span>
                                    <span>{meal.carbs}g carbs</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Link href="/menu" className="btn-black" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
                        Order Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
