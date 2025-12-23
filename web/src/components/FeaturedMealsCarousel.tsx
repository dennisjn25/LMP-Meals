
"use client";

import { useEffect, useState } from "react";
import MealShowcaseCard from "./MealShowcaseCard";
import { getFeaturedMeals } from "@/actions/meals";
import { Loader2 } from "lucide-react";

// Meal type definition based on what we need
type Meal = {
    id: string;
    title: string;
    description: string | null;
    image: string;
    category: string;
    tags: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export default function FeaturedMealsCarousel() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        async function fetchMeals() {
            try {
                const data = await getFeaturedMeals();
                setMeals(data);
            } catch (error) {
                console.error("Failed to fetch featured meals:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMeals();
    }, []);

    // Rotation logic - switch every 6 seconds
    useEffect(() => {
        if (meals.length === 0) return;

        const interval = setInterval(() => {
            setStartIndex((prev) => (prev + 1) % meals.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [meals.length]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className="animate-spin" color="#fbbf24" size={40} />
            </div>
        );
    }

    if (meals.length === 0) {
        return null;
    }

    // Determine which 3 meals to show
    // We want to loop around, so we use modulo arithmetic
    const visibleMeals = [];
    for (let i = 0; i < 3; i++) {
        const index = (startIndex + i) % meals.length;
        visibleMeals.push(meals[index]);
    }

    return (
        <div className="carousel-container" style={{ position: 'relative' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Keep responsive grid behavior
                gap: '30px',
                marginTop: '60px'
            }}>
                {/* On mobile, we might just want to show one and stack or slide. 
                    The specialized grid above fits the existing layout nicely. 
                    However, strictly rotating 1 item every 6s in a 3-item grid might look jumpy.
                    Wait, if I have 5 items: A, B, C, D, E.
                    State 0: [A, B, C]
                    State 1: [B, C, D]
                    State 2: [C, D, E]
                    This is a nice sliding window effect.
                */}
                {visibleMeals.map((meal, index) => {
                    // We use index as key to force re-render for animation if needed, or better, use meal.id
                    // Using meal.id allows React to track movement.
                    return (
                        <div key={`${meal.id}-${index}`} className="animate-fade-in">
                            <MealShowcaseCard
                                image={meal.image}
                                title={meal.title}
                                description={meal.description || `${meal.calories} cal | ${meal.protein}g Protein`}
                                tag={meal.category} // Or parse tags for a better tag
                            />
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0.5; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
