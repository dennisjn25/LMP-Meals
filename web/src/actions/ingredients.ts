"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Helper to check for admin role
const checkAuth = async () => {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (skipAuth) return true;
    // @ts-ignore
    return session?.user?.role === "ADMIN";
};

export const getIngredients = async () => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const ingredients = await db.ingredient.findMany({
            include: {
                meals: {
                    include: {
                        meal: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
        return { success: ingredients };
    } catch (error) {
        return { error: "Failed to fetch ingredients" };
    }
};

export const createIngredient = async (data: { name: string; unit: string; currentStock: number; minStock: number; costPerUnit: number }) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const ingredient = await db.ingredient.create({
            data
        });
        revalidatePath("/admin/inventory");
        return { success: ingredient };
    } catch (error) {
        return { error: "Failed to create ingredient" };
    }
};

export const updateIngredient = async (id: string, data: { name?: string; unit?: string; currentStock?: number; minStock?: number; costPerUnit?: number }) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const ingredient = await db.ingredient.update({
            where: { id },
            data
        });
        revalidatePath("/admin/inventory");
        return { success: ingredient };
    } catch (error) {
        return { error: "Failed to update ingredient" };
    }
};

export const deleteIngredient = async (id: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        await db.ingredient.delete({
            where: { id }
        });
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete ingredient" };
    }
};

export const linkIngredientToMeal = async (mealId: string, ingredientId: string, quantity: number) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        // Check if exists
        const existing = await db.mealIngredient.findUnique({
            where: {
                mealId_ingredientId: {
                    mealId,
                    ingredientId
                }
            }
        });

        if (existing) {
            await db.mealIngredient.update({
                where: { id: existing.id },
                data: { quantity }
            });
        } else {
            await db.mealIngredient.create({
                data: {
                    mealId,
                    ingredientId,
                    quantity
                }
            });
        }
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error) {
        return { error: "Failed to link ingredient" };
    }
};

export const unlinkIngredientFromMeal = async (mealId: string, ingredientId: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        await db.mealIngredient.delete({
            where: {
                mealId_ingredientId: {
                    mealId,
                    ingredientId
                }
            }
        });
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error) {
        return { error: "Failed to unlink ingredient" };
    }
};
