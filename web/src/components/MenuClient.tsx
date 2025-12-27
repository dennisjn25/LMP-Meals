"use client";

import MealCard from "@/components/MealCard";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedLogoBackground from "@/components/AnimatedLogoBackground";
import ParticleBackground from "@/components/effects/ParticleBackground";
import Image from "next/image";
import { TrendingUp, Flame, Heart, Search } from "lucide-react";
import { tokens } from "@/lib/design-tokens";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    { id: "All", name: "All Meals", icon: "🍽️", color: tokens.colors.text.secondary },
    { id: "High Protein", name: "High Protein", icon: "💪", color: tokens.colors.text.success }, // Using success for green/health
    { id: "Keto", name: "Keto Friendly", icon: "🥑", color: "#10b981" }, // Custom green
    { id: "Balanced", name: "Balanced", icon: "⚖️", color: tokens.colors.accent.DEFAULT }
];

export default function MenuClient({ meals }: { meals: Meal[] }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price" | "calories" | "protein">("price");
    const [showFilters, setShowFilters] = useState(true); // Default valid for users to find things
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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
        <main style={{ minHeight: '100dvh', background: tokens.colors.background, color: tokens.colors.text.primary }}>
            <Navbar />

            {/* Hero Header with Animated Background */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '60px' }}>
                <AnimatedLogoBackground />
                <ParticleBackground density={30} colors={['rgba(255,255,255,0.3)', 'rgba(251, 191, 36, 0.2)']} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 14, 20, 0.85)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: `linear-gradient(to bottom, transparent, ${tokens.colors.background})`, zIndex: 1, pointerEvents: 'none' }}></div>

                <div className="container" style={{ paddingTop: 'calc(120px + env(safe-area-inset-top))', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
                    <header style={{ textAlign: 'center' }}>

                        {/* Logo with Shimmer Effect */}
                        <div className="logo-shimmer-wrapper" style={{ marginBottom: tokens.spacing.xl, display: 'inline-block', position: 'relative' }}>
                            <Image
                                src="https://ijcowpujufsrdikhegxu.supabase.co/storage/v1/object/public/assets/logo.png"
                                alt="Liberty Meal Prep Logo"
                                width={120}
                                height={120}
                                style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                            />
                        </div>
                        <br />

                        <div style={{ marginBottom: tokens.spacing.lg, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.spacing.md }}>
                            <Badge variant="warning" style={{ fontSize: '0.9rem' }}>
                                ORDER BY 9PM WEDNESDAY
                            </Badge>
                            <Badge variant="error" style={{ fontSize: '0.9rem' }}>
                                ⚠️ 10 Meal Minimum For Delivery
                            </Badge>
                            <Badge variant="outline" style={{ fontSize: '0.85rem' }}>
                                ℹ️ No Substitutes or Special Orders
                            </Badge>
                        </div>

                        <h1 style={{
                            fontSize: '4rem',
                            marginBottom: tokens.spacing.md,
                            color: 'white',
                            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
                            animation: 'fadeInUp 0.8s ease-out',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            Weekly <span style={{ color: tokens.colors.accent.DEFAULT }}>Menu</span>
                        </h1>
                        <p style={{
                            color: tokens.colors.text.secondary,
                            fontSize: '1.25rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            marginBottom: tokens.spacing.xxl,
                            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                            maxWidth: '600px',
                            marginInline: 'auto'
                        }}>
                            Fresh, chef-prepared meals delivered every Sunday. Fuel your week with precision nutrition.
                        </p>

                        {/* Quick Stats */}
                        <div style={{
                            display: 'flex',
                            gap: tokens.spacing.lg,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                            marginTop: tokens.spacing.lg
                        }}>
                            <QuickStatBadge icon={<TrendingUp size={20} />} label="Meals Available" value={mealCount.toString()} />
                            <QuickStatBadge icon={<Flame size={20} />} label="Avg Calories" value={avgCalories.toString()} />
                            <QuickStatBadge icon={<Heart size={20} />} label="Avg Protein" value={`${avgProtein}g`} />
                        </div>
                    </header>
                </div>
            </div>

            <div className="container">

                {/* Filters & Search */}
                <Card style={{
                    marginBottom: tokens.spacing.xxl,
                    padding: tokens.spacing.xl,
                    background: tokens.colors.surface.light,
                    borderColor: tokens.colors.border.dark
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
                        {/* Collapsible Search Bar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: tokens.spacing.md
                        }}>
                            {!isSearchExpanded ? (
                                <button
                                    onClick={() => setIsSearchExpanded(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        background: tokens.colors.surface.medium,
                                        border: `1px solid ${tokens.colors.border.dark}`,
                                        borderRadius: tokens.radius.md,
                                        color: tokens.colors.text.secondary,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        fontFamily: 'var(--font-body)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = tokens.colors.surface.light;
                                        e.currentTarget.style.borderColor = tokens.colors.accent.DEFAULT;
                                        e.currentTarget.style.color = tokens.colors.accent.DEFAULT;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = tokens.colors.surface.medium;
                                        e.currentTarget.style.borderColor = tokens.colors.border.dark;
                                        e.currentTarget.style.color = tokens.colors.text.secondary;
                                    }}
                                >
                                    <Search size={20} />
                                    <span>Search Meals</span>
                                </button>
                            ) : (
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: '600px',
                                    animation: 'expandSearch 0.3s ease-out'
                                }}>
                                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.text.secondary, zIndex: 1 }} />
                                    <Input
                                        placeholder="Search by name, ingredients, or diet..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => {
                                            if (!searchQuery) {
                                                setIsSearchExpanded(false);
                                            }
                                        }}
                                        autoFocus
                                        style={{ paddingLeft: '48px', paddingRight: '48px', height: '56px', fontSize: '1.1rem', background: tokens.colors.surface.medium, borderColor: tokens.colors.border.dark }}
                                        fullWidth
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setIsSearchExpanded(false);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: tokens.colors.text.secondary,
                                                cursor: 'pointer',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = tokens.colors.accent.DEFAULT}
                                            onMouseLeave={(e) => e.currentTarget.style.color = tokens.colors.text.secondary}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                marginBottom: tokens.spacing.md,
                                color: tokens.colors.text.primary,
                                fontFamily: 'var(--font-heading)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'center'
                            }}>
                                Popular Categories
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: tokens.spacing.md
                            }}>
                                {CATEGORIES.map(cat => (
                                    <Button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        variant={activeCategory === cat.id ? 'primary' : 'outline'}
                                        style={{
                                            minWidth: '140px',
                                            borderColor: activeCategory === cat.id ? 'transparent' : tokens.colors.border.dark,
                                            color: activeCategory === cat.id ? 'white' : tokens.colors.text.secondary
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{cat.icon}</span>
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Meals Grid */}
                {mealCount > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: tokens.spacing.xl,
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
                    <Card style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: tokens.colors.surface.light,
                        borderColor: tokens.colors.border.dark
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: tokens.spacing.md, opacity: 0.5 }}>🔍</div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            marginBottom: tokens.spacing.sm,
                            fontFamily: 'var(--font-heading)',
                            color: 'white'
                        }}>
                            No meals found
                        </h3>
                        <p style={{ color: tokens.colors.text.secondary, marginBottom: tokens.spacing.lg }}>
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                            variant="secondary"
                        >
                            Clear All Filters
                        </Button>
                    </Card>
                )}
            </div>

            <Footer />
        </main>
    );
}

function QuickStatBadge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <Card style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderColor: tokens.colors.border.dark,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.md,
            boxShadow: tokens.shadows.md
        }}>
            <div style={{ color: tokens.colors.accent.DEFAULT }}>{icon}</div>
            <div>
                <div style={{
                    fontSize: '0.75rem',
                    color: tokens.colors.text.secondary,
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
                    color: 'white',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1
                }}>
                    {value}
                </div>
            </div>
        </Card>
    );
}
