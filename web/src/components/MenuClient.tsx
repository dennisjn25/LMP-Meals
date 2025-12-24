"use client";

import MealCard from "@/components/MealCard";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import ParticleBackground from "@/components/effects/ParticleBackground";
import Image from "next/image";
import { Filter, Search, X, TrendingUp, Flame, Heart } from "lucide-react";

interface Meal {
    id: string;
    title: string;
    description: string | null;
    image: string;
    price: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags: string; // Comma separated
    category: string;
}

const CATEGORIES = [
    { id: "All", name: "All Meals", icon: "🍽️", color: "#6b7280" },
    { id: "High Protein", name: "High Protein", icon: "💪", color: "#3b82f6" },
    { id: "Keto", name: "Keto Friendly", icon: "🥑", color: "#10b981" },
    { id: "Balanced", name: "Balanced", icon: "⚖️", color: "#fbbf24" }
];

export default function MenuClient({ meals }: { meals: Meal[] }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price" | "calories" | "protein">("price");
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort meals
    let filteredMeals = activeCategory === "All"
        ? meals
        : meals.filter(m => m.category === activeCategory);

    // Search filter
    if (searchQuery) {
        filteredMeals = filteredMeals.filter(m =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.tags.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort meals
    filteredMeals = [...filteredMeals].sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "calories") return a.calories - b.calories;
        if (sortBy === "protein") return b.protein - a.protein;
        return 0;
    });

    const mealCount = filteredMeals.length;
    const avgCalories = Math.round(filteredMeals.reduce((sum, m) => sum + m.calories, 0) / (mealCount || 1));
    const avgProtein = Math.round(filteredMeals.reduce((sum, m) => sum + m.protein, 0) / (mealCount || 1));

    return (
        <main style={{ minHeight: '100vh', background: '#0B0E14', color: '#fff' }}>
            <Navbar />

            {/* Hero Header with Animated Background */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '60px' }}>
                <AnimatedLogoBackground />
                <ParticleBackground density={30} colors={['rgba(255,255,255,0.3)', 'rgba(251, 191, 36, 0.2)']} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.85)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, transparent, #0B0E14)', zIndex: 1, pointerEvents: 'none' }}></div>

                <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
                    <header style={{ textAlign: 'center' }}>

                        {/* Logo with Shimmer Effect */}
                        <div className="logo-shimmer-wrapper" style={{ marginBottom: '32px', display: 'inline-block', position: 'relative' }}>
                            <Image
                                src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                                alt="Liberty Meal Prep Logo"
                                width={120}
                                height={120}
                                style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                            />
                        </div>
                        <br />

                        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '100px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                                ORDER BY 9PM WEDNESDAY
                            </div>
                            <div style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '100px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                ⚠️ 10 Meal Minimum For Delivery
                            </div>
                            <div style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '100px', background: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                ℹ️ No Substitutes or Special Orders
                            </div>
                        </div>

                        <h1 style={{
                            fontSize: '4rem',
                            marginBottom: '16px',
                            color: '#fff',
                            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
                            animation: 'fadeInUp 0.8s ease-out',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            Weekly <span style={{ color: '#fbbf24' }}>Menu</span>
                        </h1>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '1.25rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            marginBottom: '40px',
                            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                            maxWidth: '600px',
                            marginInline: 'auto'
                        }}>
                            Fresh, chef-prepared meals delivered every Sunday. Fuel your week with precision nutrition.
                        </p>

                        {/* Quick Stats */}
                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                            marginTop: '24px'
                        }}>
                            <QuickStatBadge icon={<TrendingUp size={20} />} label="Meals Available" value={mealCount.toString()} />
                            <QuickStatBadge icon={<Flame size={20} />} label="Avg Calories" value={avgCalories.toString()} />
                            <QuickStatBadge icon={<Heart size={20} />} label="Avg Protein" value={`${avgProtein}g`} />
                        </div>
                    </header>
                </div>
            </div>

            <div className="container">

                {/* Category Filters */}
                {showFilters && (
                    <div style={{
                        background: '#1E293B',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                        marginBottom: '40px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        animation: 'fadeInUp 0.3s ease-out'
                    }}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            marginBottom: '16px',
                            color: '#fbbf24',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Categories
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '12px'
                        }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        padding: '16px 20px',
                                        background: activeCategory === cat.id
                                            ? `linear-gradient(135deg, ${cat.color}20 0%, ${cat.color}10 100%)`
                                            : 'rgba(255,255,255,0.02)',
                                        border: activeCategory === cat.id
                                            ? `1px solid ${cat.color}`
                                            : '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontFamily: 'var(--font-heading)',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: activeCategory === cat.id ? cat.color : '#94a3b8',
                                        boxShadow: activeCategory === cat.id
                                            ? `0 4px 15px ${cat.color}20`
                                            : 'none'
                                    }}
                                    className="category-filter-btn"
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Meals Grid */}
                {mealCount > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '32px',
                        animation: 'fadeInUp 0.6s ease-out'
                    }}>
                        {filteredMeals.map((meal, index) => (
                            <div
                                key={meal.id}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                                }}
                            >
                                <MealCard meal={{
                                    ...meal,
                                    tags: meal.tags.split(',').map(t => t.trim())
                                }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: '#1E293B',
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-heading)',
                            color: '#fff'
                        }}>
                            No meals found
                        </h3>
                        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                            className="btn-black"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

function QuickStatBadge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
            <div style={{ color: '#fbbf24' }}>{icon}</div>
            <div>
                <div style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '2px',
                    fontWeight: 600
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1
                }}>
                    {value}
                </div>
            </div>
        </div>
    );
}
