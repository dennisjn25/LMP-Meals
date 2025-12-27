"use client";

import { createMeal, updateMeal, deleteMeal, toggleFeaturedMeal } from "@/actions/meals";
import { useState } from "react";
import Image from "next/image";
import { Trash2, Edit2, Plus, X, Save, UploadCloud, Loader2, Star } from "lucide-react";
import { useDropzone } from "react-dropzone";

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
    tags: string;
    category: string;
    available: boolean;
    featured: boolean;
    featuredOrder: number | null;
}

const ImageDropzone = ({ currentImage, onUploadComplete, onClear }: { currentImage?: string, onUploadComplete: (url: string) => void, onClear?: () => void }) => {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onUploadComplete(data.url);
        } catch (error) {
            console.error(error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        noClick: !!currentImage // if image exists, click shouldn't open dialog unless specific area clicked (or maybe allow click everywhere? default is nicer)
        // Actually, let's allow click everywhere to replace easiest.
    });
    // Re-enable click for replacement
    const { ref, ...rootProps } = getRootProps();

    return (
        <div
            {...rootProps}
            ref={ref}
            style={{
                border: '2px dashed #9ca3af',
                borderRadius: '16px',
                padding: currentImage ? '0' : '32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? '#eff6ff' : (currentImage ? 'transparent' : 'white'),
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s'
            }}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px' }}>
                    <Loader2 className="animate-spin" size={24} />
                    <p>Uploading...</p>
                </div>
            ) : currentImage ? (
                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                    <Image
                        src={currentImage}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover', opacity: isDragActive ? 0.5 : 1 }}
                    />

                    {/* Remove Button */}
                    {onClear && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent opening file dialog
                                onClear();
                            }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    {/* Drag overlay / Hover overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: isDragActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isDragActive ? 1 : 0,
                        transition: 'opacity 0.2s'
                    }}
                        className="hover-overlay" // Use CSS-in-JS usually, but we can rely on isDragActive for basic feedback. 
                    // For "Click to replace", maybe we don't need a visible overlay unless hovering?
                    >
                        {isDragActive && <p style={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>DROP TO REPLACE</p>}
                    </div>
                </div>
            ) : (
                <>
                    <UploadCloud size={32} style={{ marginBottom: '12px', color: '#374151' }} />
                    {isDragActive ? (
                        <p style={{ fontWeight: 600 }}>Drop the image here...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <p style={{ fontWeight: 600, color: '#111827' }}>Click to upload or drag and drop</p>
                            <p style={{ fontSize: '0.8rem' }}>SVG, PNG, JPG or GIF</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ... (In AdminMealsClient Usage)

// Replace the Image Input Section with:
/*
<div className="form-group">
    <label style={labelStyle}>Meal Image</label>
    <div style={{
        border: '2px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        background: 'rgba(255,255,255,0.02)'
    }}>
        <ImageDropzone 
            currentImage={formData.image}
            onUploadComplete={(url) => setFormData({ ...formData, image: url })} 
            onClear={() => setFormData({ ...formData, image: "" })}
        />

        <div style={{ marginTop: '16px' }}>
            <details style={{ cursor: 'pointer' }}>
                <summary style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enter Image URL</summary>
                <input
                    style={{ ...inputStyle, padding: '8px 12px', marginTop: '12px', fontSize: '0.85rem' }}
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://external-storage.com/image.jpg"
                />
            </details>
        </div>
    </div>
</div>
*/

export default function AdminMealsClient({ initialMeals }: { initialMeals: Meal[] }) {
    const [meals, setMeals] = useState(initialMeals); // Local state for optimistic updates / immediate feedback, though revalidatePath works too.
    // Actually, if we use server actions with revalidate, we might not need complex local state syncing if we refresh router, but simple state is faster.

    // We will rely on the page reload or proper revalidation. 
    // Since we passed initialMeals, to see updates we'd need to refresh or use router.refresh().

    // For simplicity: simple form that reloads page or just assumes success for now, 
    // OR we just use the props and let the parent re-render? Parent won't re-render unless we trigger router.refresh().
    // let's do router.refresh() after actions.

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "/meals/meal-1.jpg",
        price: 13.99,
        calories: 500,
        protein: 40,
        carbs: 40,
        fat: 15,
        tags: "",
        category: "Balanced"
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            image: "/meals/meal-1.jpg",
            price: 13.99,
            calories: 500,
            protein: 40,
            carbs: 40,
            fat: 15,
            tags: "",
            category: "Balanced"
        });
        setEditingId(null);
        setIsEditing(false);
    };

    const handleEdit = (meal: Meal) => {
        setFormData({
            title: meal.title,
            description: meal.description || "",
            image: meal.image,
            price: meal.price,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            tags: meal.tags,
            category: meal.category
        });
        setEditingId(meal.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this meal?")) return;
        await deleteMeal(id);
        // window.location.reload(); // brute force refresh
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMeal(editingId, formData);
            } else {
                await createMeal(formData);
            }
            resetForm();
            window.location.reload();
        } catch (error) {
            console.error("Failed to save meal", error);
            alert("Failed to save meal");
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            await toggleFeaturedMeal(id, !currentFeatured);
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to update featured status");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meal Management</h2>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'transparent',
                        color: '#fbbf24',
                        border: '2px solid #fbbf24',
                        padding: '10px 24px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fbbf24';
                        e.currentTarget.style.color = 'black';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#fbbf24';
                    }}
                >
                    <Plus size={18} /> Add New Meal
                </button>
            </div>

            {/* List */}
            {!isEditing && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {initialMeals.map(meal => (
                        <div key={meal.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ height: '220px', position: 'relative', background: 'rgba(255,255,255,0.05)' }}>
                                <Image
                                    src={meal.image}
                                    alt={meal.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/meals/meal-1.jpg';
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#fbbf24',
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontWeight: 900,
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.1rem',
                                    border: '1px solid rgba(251, 191, 36, 0.3)'
                                }}>
                                    ${meal.price.toFixed(2)}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(4px)',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {meal.category}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    color: 'white',
                                    fontFamily: 'var(--font-heading)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase'
                                }}>{meal.title}</h3>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: 'white' }}>{meal.calories}</span> KCAL
                                    </span>
                                    <span style={{ opacity: 0.3 }}>|</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: 'white' }}>{meal.protein}G</span> PROTEIN
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleEdit(meal)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        <Edit2 size={14} /> EDIT
                                    </button>
                                    <button
                                        onClick={() => handleToggleFeatured(meal.id, meal.featured)}
                                        style={{
                                            padding: '12px',
                                            background: meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)',
                                            color: meal.featured ? '#fbbf24' : 'white',
                                            border: meal.featured ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title={meal.featured ? `Week's Menu #${meal.featuredOrder} - Click to remove` : 'Add to this week\'s menu (max 5)'}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)';
                                        }}
                                    >
                                        <Star size={16} fill={meal.featured ? '#fbbf24' : 'none'} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(meal.id)}
                                        style={{
                                            padding: '12px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor */}
            {isEditing && (
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    maxWidth: '900px',
                    margin: '0 auto',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {editingId ? 'Edit Meal Details' : 'Add New Meal'}
                        </h3>
                        <button
                            onClick={resetForm}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: '#94a3b8',
                                padding: '8px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>
                        {/* Basic Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div className="form-group">
                                <label style={labelStyle}>Meal Title</label>
                                <input
                                    required
                                    style={inputStyle}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Price ($)</label>
                                <input
                                    type="number" step="0.01" required
                                    style={inputStyle}
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={labelStyle}>Description / Specifications</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Macros Header */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Nutritional Information</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Calories (KCAL)</label>
                                    <input type="number" required style={inputStyle}
                                        value={formData.calories} onChange={e => setFormData({ ...formData, calories: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ ...labelStyle, fontSize: '0.7rem' }}>PROTEIN (G)</label>
                                    <input type="number" required style={inputStyle}
                                        value={formData.protein} onChange={e => setFormData({ ...formData, protein: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ ...labelStyle, fontSize: '0.7rem' }}>CARBS (G)</label>
                                    <input type="number" required style={inputStyle}
                                        value={formData.carbs} onChange={e => setFormData({ ...formData, carbs: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ ...labelStyle, fontSize: '0.7rem' }}>FAT (G)</label>
                                    <input type="number" required style={inputStyle}
                                        value={formData.fat} onChange={e => setFormData({ ...formData, fat: parseInt(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select
                                    style={inputStyle}
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Balanced">Balanced</option>
                                    <option value="High Protein">High Protein</option>
                                    <option value="Keto">Keto</option>
                                    <option value="Bulk">Bulk</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Tags (Comma Separated)</label>
                                <input
                                    placeholder="e.g. GF, DAIRY-FREE, CRITICAL"
                                    style={inputStyle}
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={labelStyle}>Meal Image</label>
                            <div style={{
                                border: '2px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                padding: '24px',
                                background: 'rgba(255,255,255,0.02)'
                            }}>
                                <ImageDropzone
                                    currentImage={formData.image}
                                    onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                                    onClear={() => setFormData({ ...formData, image: "" })}
                                />

                                <div style={{ marginTop: '16px' }}>
                                    <details style={{ cursor: 'pointer' }}>
                                        <summary style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enter Image URL</summary>
                                        <input
                                            style={{ ...inputStyle, padding: '8px 12px', marginTop: '12px', fontSize: '0.85rem' }}
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://external-storage.com/image.jpg"
                                        />
                                    </details>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 2,
                                    padding: '18px',
                                    background: '#fbbf24',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 900,
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 10px 30px -10px rgba(251, 191, 36, 0.5)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Save size={20} />
                                    {editingId ? 'SAVE CHANGES' : 'CREATE MEAL'}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    flex: 1,
                                    padding: '18px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-heading)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '10px',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none'
};
