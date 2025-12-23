"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Type definitions
export interface PromoCodeFormData {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    startDate: Date;
    endDate: Date;
    maxRedemptions?: number | null;
    applicableProducts?: string[] | null;
    applicableCategories?: string[] | null;
    minOrderValue?: number | null;
    description?: string | null;
    isActive: boolean;
}

export interface PromoCodeValidationResult {
    isValid: boolean;
    error?: string;
    discount?: {
        type: "PERCENTAGE" | "FIXED";
        value: number;
    };
}

// Helper function to create audit log
async function createAuditLog(
    action: string,
    entityType: string,
    entityId: string | null,
    details: any
) {
    const session = await auth();

    await db.auditLog.create({
        data: {
            action,
            entityType,
            entityId,
            userId: session?.user?.id || null,
            userName: session?.user?.name || "System",
            details: JSON.stringify(details),
        },
    });
}

// Validate promo code format
function validatePromoCodeFormat(code: string): { valid: boolean; error?: string } {
    // Allow any characters, 3-20 characters length
    // Trim whitespace from start and end
    const trimmedCode = code.trim();

    if (trimmedCode.length < 3 || trimmedCode.length > 20) {
        return {
            valid: false,
            error: "Promo code must be between 3 and 20 characters",
        };
    }

    return { valid: true };
}

// Validate discount value
function validateDiscountValue(
    type: "PERCENTAGE" | "FIXED",
    value: number
): { valid: boolean; error?: string } {
    if (type === "PERCENTAGE") {
        if (value <= 0 || value > 100) {
            return {
                valid: false,
                error: "Percentage discount must be between 0 and 100",
            };
        }
    } else if (type === "FIXED") {
        if (value <= 0) {
            return {
                valid: false,
                error: "Fixed discount must be greater than 0",
            };
        }
    }

    return { valid: true };
}

// Validate date range
function validateDateRange(
    startDate: Date,
    endDate: Date
): { valid: boolean; error?: string } {
    const now = new Date();

    if (endDate <= startDate) {
        return {
            valid: false,
            error: "End date must be after start date",
        };
    }

    // Allow creating promo codes that start in the past (for testing/backdating)
    // but warn if end date is in the past
    if (endDate < now) {
        return {
            valid: false,
            error: "End date cannot be in the past",
        };
    }

    return { valid: true };
}

// Get all promo codes (admin only)
export async function getAllPromoCodes() {
    const session = await auth();

    // Check admin access
    const skipAuth = process.env.SKIP_AUTH === "true";
    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const promoCodes = await db.promoCode.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return promoCodes;
}

// Create new promo code
export async function createPromoCode(data: PromoCodeFormData) {
    const session = await auth();

    // Check admin access
    const skipAuth = process.env.SKIP_AUTH === "true";
    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    // Validate code format
    const codeValidation = validatePromoCodeFormat(data.code);
    if (!codeValidation.valid) {
        throw new Error(codeValidation.error);
    }

    // Check if code already exists
    const existing = await db.promoCode.findUnique({
        where: { code: data.code },
    });

    if (existing) {
        throw new Error("Promo code already exists");
    }

    // Validate discount value
    const discountValidation = validateDiscountValue(
        data.discountType,
        data.discountValue
    );
    if (!discountValidation.valid) {
        throw new Error(discountValidation.error);
    }

    // Validate date range
    const dateValidation = validateDateRange(data.startDate, data.endDate);
    if (!dateValidation.valid) {
        throw new Error(dateValidation.error);
    }

    // Check for date conflicts with existing active codes
    const conflictingCodes = await db.promoCode.findMany({
        where: {
            code: data.code,
            isActive: true,
            OR: [
                {
                    AND: [
                        { startDate: { lte: data.endDate } },
                        { endDate: { gte: data.startDate } },
                    ],
                },
            ],
        },
    });

    if (conflictingCodes.length > 0) {
        throw new Error(
            "A promo code with this code already exists in the specified date range"
        );
    }

    // Create promo code
    const promoCode = await db.promoCode.create({
        data: {
            code: data.code,
            discountType: data.discountType,
            discountValue: data.discountValue,
            startDate: data.startDate,
            endDate: data.endDate,
            maxRedemptions: data.maxRedemptions,
            applicableProducts: data.applicableProducts?.join(",") || null,
            applicableCategories: data.applicableCategories?.join(",") || null,
            minOrderValue: data.minOrderValue,
            description: data.description,
            isActive: data.isActive,
            createdBy: session?.user?.id || null,
        },
    });

    // Create audit log
    await createAuditLog("CREATE_PROMO", "PROMO_CODE", promoCode.id, {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
    });

    revalidatePath("/admin/promo-codes");

    return promoCode;
}

// Update promo code
export async function updatePromoCode(id: string, data: Partial<PromoCodeFormData>) {
    const session = await auth();

    // Check admin access
    const skipAuth = process.env.SKIP_AUTH === "true";
    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    // Get existing promo code
    const existing = await db.promoCode.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new Error("Promo code not found");
    }

    // Validate code format if code is being updated
    if (data.code && data.code !== existing.code) {
        const codeValidation = validatePromoCodeFormat(data.code);
        if (!codeValidation.valid) {
            throw new Error(codeValidation.error);
        }

        // Check if new code already exists
        const codeExists = await db.promoCode.findUnique({
            where: { code: data.code },
        });

        if (codeExists) {
            throw new Error("Promo code already exists");
        }
    }

    // Validate discount value if being updated
    if (data.discountType || data.discountValue) {
        const type = data.discountType || existing.discountType;
        const value = data.discountValue ?? existing.discountValue;

        const discountValidation = validateDiscountValue(
            type as "PERCENTAGE" | "FIXED",
            value
        );
        if (!discountValidation.valid) {
            throw new Error(discountValidation.error);
        }
    }

    // Validate date range if being updated
    if (data.startDate || data.endDate) {
        const startDate = data.startDate || existing.startDate;
        const endDate = data.endDate || existing.endDate;

        const dateValidation = validateDateRange(startDate, endDate);
        if (!dateValidation.valid) {
            throw new Error(dateValidation.error);
        }
    }

    // Update promo code
    const updated = await db.promoCode.update({
        where: { id },
        data: {
            ...(data.code && { code: data.code }),
            ...(data.discountType && { discountType: data.discountType }),
            ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
            ...(data.startDate && { startDate: data.startDate }),
            ...(data.endDate && { endDate: data.endDate }),
            ...(data.maxRedemptions !== undefined && { maxRedemptions: data.maxRedemptions }),
            ...(data.applicableProducts !== undefined && {
                applicableProducts: data.applicableProducts?.join(",") || null,
            }),
            ...(data.applicableCategories !== undefined && {
                applicableCategories: data.applicableCategories?.join(",") || null,
            }),
            ...(data.minOrderValue !== undefined && { minOrderValue: data.minOrderValue }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
    });

    // Create audit log
    await createAuditLog("UPDATE_PROMO", "PROMO_CODE", id, {
        changes: data,
    });

    revalidatePath("/admin/promo-codes");

    return updated;
}

// Delete promo code
export async function deletePromoCode(id: string) {
    const session = await auth();

    // Check admin access
    const skipAuth = process.env.SKIP_AUTH === "true";
    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const promoCode = await db.promoCode.findUnique({
        where: { id },
    });

    if (!promoCode) {
        throw new Error("Promo code not found");
    }

    await db.promoCode.delete({
        where: { id },
    });

    // Create audit log
    await createAuditLog("DELETE_PROMO", "PROMO_CODE", id, {
        code: promoCode.code,
    });

    revalidatePath("/admin/promo-codes");

    return { success: true };
}

// Validate and apply promo code (for checkout)
export async function validatePromoCode(
    code: string,
    orderTotal: number,
    mealIds: string[]
): Promise<PromoCodeValidationResult> {
    const promoCode = await db.promoCode.findUnique({
        where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
        return {
            isValid: false,
            error: "Invalid promo code",
        };
    }

    // Check if active
    if (!promoCode.isActive) {
        return {
            isValid: false,
            error: "This promo code is no longer active",
        };
    }

    // Check date range
    const now = new Date();
    if (now < promoCode.startDate) {
        return {
            isValid: false,
            error: "This promo code is not yet valid",
        };
    }

    if (now > promoCode.endDate) {
        return {
            isValid: false,
            error: "This promo code has expired",
        };
    }

    // Check usage limits
    if (
        promoCode.maxRedemptions &&
        promoCode.currentRedemptions >= promoCode.maxRedemptions
    ) {
        return {
            isValid: false,
            error: "This promo code has reached its usage limit",
        };
    }

    // Check minimum order value
    if (promoCode.minOrderValue && orderTotal < promoCode.minOrderValue) {
        return {
            isValid: false,
            error: `Minimum order value of $${promoCode.minOrderValue} required`,
        };
    }

    // Check applicable products
    if (promoCode.applicableProducts) {
        const applicableIds = promoCode.applicableProducts.split(",");
        const hasApplicableProduct = mealIds.some((id) =>
            applicableIds.includes(id)
        );

        if (!hasApplicableProduct) {
            return {
                isValid: false,
                error: "This promo code is not applicable to your cart items",
            };
        }
    }

    // Check applicable categories
    if (promoCode.applicableCategories) {
        const meals = await db.meal.findMany({
            where: {
                id: {
                    in: mealIds,
                },
            },
            select: {
                category: true,
            },
        });

        const applicableCategories = promoCode.applicableCategories.split(",");
        const hasApplicableCategory = meals.some((meal) =>
            applicableCategories.includes(meal.category)
        );

        if (!hasApplicableCategory) {
            return {
                isValid: false,
                error: "This promo code is not applicable to your cart items",
            };
        }
    }

    return {
        isValid: true,
        discount: {
            type: promoCode.discountType as "PERCENTAGE" | "FIXED",
            value: promoCode.discountValue,
        },
    };
}

// Increment promo code usage (called after successful order)
export async function incrementPromoCodeUsage(code: string) {
    await db.promoCode.update({
        where: { code: code.toUpperCase() },
        data: {
            currentRedemptions: {
                increment: 1,
            },
        },
    });
}

// Get all meals for dropdown (helper)
export async function getMealsForPromoCode() {
    const meals = await db.meal.findMany({
        select: {
            id: true,
            title: true,
            category: true,
        },
        orderBy: {
            title: "asc",
        },
    });

    return meals;
}

// Get unique categories
export async function getCategoriesForPromoCode() {
    const meals = await db.meal.findMany({
        select: {
            category: true,
        },
        distinct: ["category"],
    });

    return meals.map((m) => m.category);
}
