"use client";

import { useState, useEffect } from "react";
import {
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    getMealsForPromoCode,
    getCategoriesForPromoCode,
    type PromoCodeFormData,
} from "@/actions/promo-codes";

interface PromoCode {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    maxRedemptions: number | null;
    currentRedemptions: number;
    applicableProducts: string | null;
    applicableCategories: string | null;
    minOrderValue: number | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface Meal {
    id: string;
    title: string;
    category: string;
}

export default function AdminPromoCodesClient({
    initialPromoCodes,
}: {
    initialPromoCodes: PromoCode[];
}) {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Dropdown data
    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    // Form state
    const [formData, setFormData] = useState<PromoCodeFormData>({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxRedemptions: null,
        applicableProducts: null,
        applicableCategories: null,
        minOrderValue: null,
        description: null,
        isActive: true,
    });

    // Load meals and categories on mount
    useEffect(() => {
        loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
        try {
            const [mealsData, categoriesData] = await Promise.all([
                getMealsForPromoCode(),
                getCategoriesForPromoCode(),
            ]);
            setMeals(mealsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error("Failed to load dropdown data:", err);
        }
    };

    const resetForm = () => {
        setFormData({
            code: "",
            discountType: "PERCENTAGE",
            discountValue: 0,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            maxRedemptions: null,
            applicableProducts: null,
            applicableCategories: null,
            minOrderValue: null,
            description: null,
            isActive: true,
        });
        setEditingId(null);
        setShowForm(false);
        setError(null);
        setSuccess(null);
    };

    const handleEdit = (promoCode: PromoCode) => {
        setFormData({
            code: promoCode.code,
            discountType: promoCode.discountType as "PERCENTAGE" | "FIXED",
            discountValue: promoCode.discountValue,
            startDate: new Date(promoCode.startDate),
            endDate: new Date(promoCode.endDate),
            maxRedemptions: promoCode.maxRedemptions,
            applicableProducts: promoCode.applicableProducts?.split(",") || null,
            applicableCategories: promoCode.applicableCategories?.split(",") || null,
            minOrderValue: promoCode.minOrderValue,
            description: promoCode.description,
            isActive: promoCode.isActive,
        });
        setEditingId(promoCode.id);
        setShowForm(true);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (editingId) {
                // Update existing promo code
                const updated = await updatePromoCode(editingId, formData);
                setPromoCodes((prev) =>
                    prev.map((pc) => (pc.id === editingId ? updated : pc))
                );
                setSuccess("Promo code updated successfully!");
            } else {
                // Create new promo code
                const newPromoCode = await createPromoCode(formData);
                setPromoCodes((prev) => [newPromoCode, ...prev]);
                setSuccess("Promo code created successfully!");
            }

            setTimeout(() => {
                resetForm();
            }, 1500);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo code?")) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await deletePromoCode(id);
            setPromoCodes((prev) => prev.filter((pc) => pc.id !== id));
            setSuccess("Promo code deleted successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to delete promo code");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Action Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                    {promoCodes.length} promo code{promoCodes.length !== 1 ? "s" : ""}
                </div>

                <button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    style={{
                        padding: "12px 24px",
                        background: showForm ? "#1e293b" : "linear-gradient(135deg, #D4AF37 0%, #F4E5A1 100%)",
                        color: showForm ? "#94a3b8" : "#000",
                        border: showForm ? "1px solid #334155" : "none",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.5px",
                    }}
                >
                    {showForm ? "CANCEL" : "+ NEW PROMO CODE"}
                </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div
                    style={{
                        padding: "16px",
                        background: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        borderRadius: "8px",
                        color: "#22c55e",
                        fontSize: "0.95rem",
                    }}
                >
                    {success}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "16px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "8px",
                        color: "#ef4444",
                        fontSize: "0.95rem",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1.5rem",
                            fontFamily: "var(--font-heading)",
                            color: "#D4AF37",
                            marginBottom: "8px",
                        }}
                    >
                        {editingId ? "EDIT PROMO CODE" : "CREATE NEW PROMO CODE"}
                    </h3>

                    {/* Grid Layout for Form Fields */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "20px",
                        }}
                    >
                        {/* Promo Code */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Promo Code *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                placeholder="e.g., SAVE20, 11:11, HOLIDAY-25"
                                minLength={3}
                                maxLength={20}
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                3-20 characters, any format allowed
                            </span>
                        </div>

                        {/* Discount Type */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Discount Type *
                            </label>
                            <select
                                required
                                value={formData.discountType}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountType: e.target.value as "PERCENTAGE" | "FIXED",
                                    })
                                }
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount ($)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Discount Value *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
                                step="0.01"
                                value={formData.discountValue}
                                onChange={(e) =>
                                    setFormData({ ...formData, discountValue: parseFloat(e.target.value) })
                                }
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                {formData.discountType === "PERCENTAGE"
                                    ? "0-100 for percentage discount"
                                    : "Dollar amount"}
                            </span>
                        </div>

                        {/* Max Redemptions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Max Redemptions
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxRedemptions || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxRedemptions: e.target.value ? parseInt(e.target.value) : null,
                                    })
                                }
                                placeholder="Unlimited"
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                Leave empty for unlimited uses
                            </span>
                        </div>

                        {/* Start Date */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formatDateForInput(formData.startDate)}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: new Date(e.target.value) })
                                }
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </div>

                        {/* End Date */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                End Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formatDateForInput(formData.endDate)}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: new Date(e.target.value) })
                                }
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </div>

                        {/* Min Order Value */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                                Minimum Order Value
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.minOrderValue || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        minOrderValue: e.target.value ? parseFloat(e.target.value) : null,
                                    })
                                }
                                placeholder="No minimum"
                                style={{
                                    padding: "12px",
                                    background: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </div>

                        {/* Active Status */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "28px" }}>
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.target.checked })
                                }
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <label
                                htmlFor="isActive"
                                style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}
                            >
                                Active
                            </label>
                        </div>
                    </div>

                    {/* Full Width Fields */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                            Applicable Products
                        </label>
                        <select
                            multiple
                            value={formData.applicableProducts || []}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                setFormData({
                                    ...formData,
                                    applicableProducts: selected.length > 0 ? selected : null,
                                });
                            }}
                            style={{
                                padding: "12px",
                                background: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "0.95rem",
                                minHeight: "120px",
                            }}
                        >
                            {meals.map((meal) => (
                                <option key={meal.id} value={meal.id}>
                                    {meal.title} ({meal.category})
                                </option>
                            ))}
                        </select>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                            Hold Ctrl/Cmd to select multiple. Leave empty for all products.
                        </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                            Applicable Categories
                        </label>
                        <select
                            multiple
                            value={formData.applicableCategories || []}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                setFormData({
                                    ...formData,
                                    applicableCategories: selected.length > 0 ? selected : null,
                                });
                            }}
                            style={{
                                padding: "12px",
                                background: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "0.95rem",
                                minHeight: "100px",
                            }}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                            Hold Ctrl/Cmd to select multiple. Leave empty for all categories.
                        </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                            Description (Internal)
                        </label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value || null })
                            }
                            placeholder="Internal notes about this promo code..."
                            rows={3}
                            style={{
                                padding: "12px",
                                background: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "0.95rem",
                                fontFamily: "inherit",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            style={{
                                padding: "12px 24px",
                                background: "#1e293b",
                                color: "#94a3b8",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "12px 32px",
                                background: loading
                                    ? "#64748b"
                                    : "linear-gradient(135deg, #D4AF37 0%, #F4E5A1 100%)",
                                color: "#000",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "var(--font-heading)",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {loading ? "SAVING..." : editingId ? "UPDATE" : "CREATE"}
                        </button>
                    </div>
                </form>
            )}

            {/* Promo Codes Table */}
            <div
                style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#0f172a", borderBottom: "1px solid #334155" }}>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    CODE
                                </th>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    DISCOUNT
                                </th>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    VALID DATES
                                </th>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "left",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    USAGE
                                </th>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "center",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    STATUS
                                </th>
                                <th
                                    style={{
                                        padding: "16px",
                                        textAlign: "right",
                                        color: "#D4AF37",
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCodes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            padding: "48px",
                                            textAlign: "center",
                                            color: "#64748b",
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        No promo codes found. Create your first one above.
                                    </td>
                                </tr>
                            ) : (
                                promoCodes.map((promoCode) => {
                                    const isExpired = new Date(promoCode.endDate) < new Date();
                                    const isNotStarted = new Date(promoCode.startDate) > new Date();
                                    const isMaxedOut =
                                        promoCode.maxRedemptions &&
                                        promoCode.currentRedemptions >= promoCode.maxRedemptions;

                                    return (
                                        <tr
                                            key={promoCode.id}
                                            style={{
                                                borderBottom: "1px solid #334155",
                                                transition: "background 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#0f172a";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "transparent";
                                            }}
                                        >
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <span
                                                        style={{
                                                            color: "white",
                                                            fontWeight: 700,
                                                            fontSize: "0.95rem",
                                                            fontFamily: "monospace",
                                                        }}
                                                    >
                                                        {promoCode.code}
                                                    </span>
                                                    {promoCode.description && (
                                                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                                            {promoCode.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                                                    {promoCode.discountType === "PERCENTAGE"
                                                        ? `${promoCode.discountValue}%`
                                                        : `$${promoCode.discountValue.toFixed(2)}`}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                    <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                                                        {formatDate(promoCode.startDate)}
                                                    </span>
                                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                                        to {formatDate(promoCode.endDate)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                                                    {promoCode.currentRedemptions}
                                                    {promoCode.maxRedemptions && ` / ${promoCode.maxRedemptions}`}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "center" }}>
                                                <span
                                                    style={{
                                                        padding: "4px 12px",
                                                        borderRadius: "12px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        background: isExpired
                                                            ? "rgba(239, 68, 68, 0.1)"
                                                            : isNotStarted
                                                                ? "rgba(251, 191, 36, 0.1)"
                                                                : isMaxedOut
                                                                    ? "rgba(239, 68, 68, 0.1)"
                                                                    : promoCode.isActive
                                                                        ? "rgba(34, 197, 94, 0.1)"
                                                                        : "rgba(100, 116, 139, 0.1)",
                                                        color: isExpired
                                                            ? "#ef4444"
                                                            : isNotStarted
                                                                ? "#fbbf24"
                                                                : isMaxedOut
                                                                    ? "#ef4444"
                                                                    : promoCode.isActive
                                                                        ? "#22c55e"
                                                                        : "#64748b",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {isExpired
                                                        ? "EXPIRED"
                                                        : isNotStarted
                                                            ? "SCHEDULED"
                                                            : isMaxedOut
                                                                ? "MAXED OUT"
                                                                : promoCode.isActive
                                                                    ? "ACTIVE"
                                                                    : "INACTIVE"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                    <button
                                                        onClick={() => handleEdit(promoCode)}
                                                        disabled={loading}
                                                        style={{
                                                            padding: "8px 16px",
                                                            background: "#334155",
                                                            color: "#cbd5e1",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            fontSize: "0.85rem",
                                                            fontWeight: 600,
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) {
                                                                e.currentTarget.style.background = "#475569";
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "#334155";
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(promoCode.id)}
                                                        disabled={loading}
                                                        style={{
                                                            padding: "8px 16px",
                                                            background: "rgba(239, 68, 68, 0.1)",
                                                            color: "#ef4444",
                                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                                            borderRadius: "6px",
                                                            fontSize: "0.85rem",
                                                            fontWeight: 600,
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) {
                                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
