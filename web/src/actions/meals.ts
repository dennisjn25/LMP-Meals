"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMeals() {
    return await db.meal.findMany({
        where: { available: true },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getFeaturedMeals() {
    return await db.meal.findMany({
        where: {
            featured: true,
            available: true
        },
        orderBy: { featuredOrder: 'asc' },
        take: 5
    });
}

export async function getAllMealsAdmin() {
    return await db.meal.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            ingredients: {
                include: {
                    ingredient: true
                }
            }
        }
    });
}

import { auth } from "@/auth";

// ... existing imports

export async function createMeal(data: {
    title: string;
    description?: string;
    image: string;
    price: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags: string;
    category: string;
    ingredientIds?: string[];
}) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const meal = await db.meal.create({
        data: {
            title: data.title,
            description: data.description || "",
            image: data.image,
            price: data.price,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            tags: data.tags,
            category: data.category
        }
    });

    if (data.ingredientIds && data.ingredientIds.length > 0) {
        await db.mealIngredient.createMany({
            data: data.ingredientIds.map(id => ({
                mealId: meal.id,
                ingredientId: id,
                quantity: 1 // Default quantity
            }))
        });
    }

    revalidatePath("/menu");
    revalidatePath("/admin/meals");
    revalidatePath("/");
}

export async function updateMeal(id: string, data: Partial<{
    title: string;
    description: string;
    image: string;
    price: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags: string;
    category: string;
    available: boolean;
    ingredientIds: string[];
}>) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const { ingredientIds, ...mealData } = data;

    await db.meal.update({
        where: { id },
        data: mealData
    });

    if (ingredientIds !== undefined) {
        // Replace ingredients
        await db.mealIngredient.deleteMany({
            where: { mealId: id }
        });

        if (ingredientIds.length > 0) {
            await db.mealIngredient.createMany({
                data: ingredientIds.map(ingId => ({
                    mealId: id,
                    ingredientId: ingId,
                    quantity: 1 // Default quantity
                }))
            });
        }
    }

    revalidatePath("/menu");
    revalidatePath("/admin/meals");
    revalidatePath("/");
}

export async function toggleFeaturedMeal(id: string, featured: boolean) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    if (featured) {
        // Check how many meals are already featured
        const featuredCount = await db.meal.count({
            where: { featured: true }
        });

        if (featuredCount >= 5) {
            throw new Error("Maximum of 5 featured meals allowed. Please unfeature another meal first.");
        }

        // Get the next order number
        const maxOrder = await db.meal.findFirst({
            where: { featured: true },
            orderBy: { featuredOrder: 'desc' },
            select: { featuredOrder: true }
        });

        const nextOrder = (maxOrder?.featuredOrder || 0) + 1;

        await db.meal.update({
            where: { id },
            data: {
                featured: true,
                featuredOrder: nextOrder
            }
        });
    } else {
        // Unfeature the meal
        const meal = await db.meal.findUnique({
            where: { id },
            select: { featuredOrder: true }
        });

        await db.meal.update({
            where: { id },
            data: {
                featured: false,
                featuredOrder: null
            }
        });

        // Reorder remaining featured meals
        if (meal?.featuredOrder) {
            await db.meal.updateMany({
                where: {
                    featured: true,
                    featuredOrder: { gt: meal.featuredOrder }
                },
                data: {
                    featuredOrder: { decrement: 1 }
                }
            });
        }
    }

    revalidatePath("/menu");
    revalidatePath("/admin/meals");
    revalidatePath("/");
}

export async function toggleMealAvailability(id: string, available: boolean) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.meal.update({
        where: { id },
        data: { available }
    });

    revalidatePath("/menu");
    revalidatePath("/admin/meals");
    revalidatePath("/admin/inventory");
    revalidatePath("/");
}

export async function deleteMeal(id: string) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.meal.delete({
        where: { id }
    });
    revalidatePath("/menu");
    revalidatePath("/admin/meals");
    revalidatePath("/");
}

export async function seedInitialMeals() {
    const count = await db.meal.count();
    if (count > 0) return;

    const MEALS = [
        {
            title: "Grilled Chicken & Turmeric Rice",
            image: "/meals/meal-1.jpg",
            calories: 450,
            protein: 45,
            carbs: 35,
            fat: 12,
            price: 13.99,
            tags: "High Protein,GF",
            category: "Balanced",
            description: "Tender grilled chicken breast served with aromatic turmeric rice and seasonal vegetables."
        },
        {
            title: "Steak & Sweet Potato Mash",
            image: "/meals/meal-2.jpg",
            calories: 520,
            protein: 48,
            carbs: 40,
            fat: 18,
            price: 15.99,
            tags: "Bulking,GF",
            category: "High Protein",
            description: "Juicy steak slices paired with creamy sweet potato mash for the ultimate post-workout fuel."
        },
        {
            title: "Lean Turkey Meatballs & Zucchini",
            image: "/meals/meal-3.jpg",
            calories: 380,
            protein: 35,
            carbs: 12,
            fat: 18,
            price: 13.99,
            tags: "Keto,Low Carb",
            category: "Keto",
            description: "Flavorful turkey meatballs served over spiralized zucchini noodles."
        },
        {
            title: "Salmon & Asparagus",
            image: "/meals/meal-4.jpg",
            calories: 420,
            protein: 38,
            carbs: 10,
            fat: 22,
            price: 16.99,
            tags: "Keto,GF,Omega-3",
            category: "Keto",
            description: "Fresh Atlantic salmon fillet grilled to perfection with crisp asparagus spears."
        },
        {
            title: "Teriyaki Chicken Bowl",
            image: "/meals/meal-5.jpg",
            calories: 480,
            protein: 42,
            carbs: 45,
            fat: 10,
            price: 13.99,
            tags: "Balanced,Dairy Free",
            category: "Balanced",
            description: "Classic teriyaki chicken thigh glazed in house-made sauce served with jasmine rice."
        }
    ];

    for (const meal of MEALS) {
        await db.meal.create({ data: meal });
    }
}
