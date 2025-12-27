"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Save, X } from "lucide-react";
import { createIngredient, updateIngredient, deleteIngredient } from "@/actions/ingredients";
import { toast } from "sonner";
import { tokens } from "@/lib/design-tokens";

interface Ingredient {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPerUnit: number;
    updatedAt: string;
}

export default function AdminIngredientList({ ingredients }: { ingredients: Ingredient[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        currentStock: 0,
        minStock: 0,
        costPerUnit: 0
    });

    const filteredIngredients = ingredients.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (ing: Ingredient) => {
        setFormData({
            name: ing.name,
            unit: ing.unit,
            currentStock: ing.currentStock,
            minStock: ing.minStock,
            costPerUnit: ing.costPerUnit
        });
        setEditingId(ing.id);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setFormData({
            name: "",
            unit: "kg",
            currentStock: 0,
            minStock: 0,
            costPerUnit: 0
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateIngredient(editingId, formData);
                toast.success("Ingredient updated");
            } else {
                await createIngredient(formData);
                toast.success("Ingredient created");
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure? This cannot be undone.")) {
            await deleteIngredient(id);
            toast.success("Ingredient deleted");
        }
    };

    return (
        <div>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px',
                gap: '16px'
            }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#fbbf24',
                        color: 'black',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    Add Ingredient
                </button>
            </div>

            {/* Table */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                            <th style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</th>
                            <th style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost</th>
                            <th style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIngredients.map((ing) => (
                            <tr key={ing.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '20px 24px', fontWeight: 600, color: 'white' }}>{ing.name}</td>
                                <td style={{ padding: '20px 24px', color: '#cbd5e1' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{ing.currentStock}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{ing.unit}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px', color: '#cbd5e1' }}>${ing.costPerUnit.toFixed(2)} / {ing.unit}</td>
                                <td style={{ padding: '20px 24px' }}>
                                    {ing.currentStock <= ing.minStock ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            <AlertTriangle size={14} /> Low Stock
                                        </span>
                                    ) : (
                                        <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>In Stock</span>
                                    )}
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(ing)} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(ing.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#1e293b', padding: '32px', borderRadius: '24px', width: '500px',
                        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{editingId ? 'Edit Ingredient' : 'New Ingredient'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px' }}>Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px' }}>Unit</label>
                                    <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                                        <option value="kg">kg</option>
                                        <option value="lb">lb</option>
                                        <option value="oz">oz</option>
                                        <option value="g">g</option>
                                        <option value="l">liter</option>
                                        <option value="unit">unit</option>
                                        <option value="bunch">bunch</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px' }}>Cost Per Unit ($)</label>
                                    <input required type="number" step="0.01" value={formData.costPerUnit} onChange={e => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px' }}>Current Stock</label>
                                    <input required type="number" step="0.1" value={formData.currentStock} onChange={e => setFormData({ ...formData, currentStock: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px' }}>Min Stock Alert</label>
                                    <input required type="number" step="0.1" value={formData.minStock} onChange={e => setFormData({ ...formData, minStock: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                            </div>
                            <button type="submit" style={{ padding: '16px', background: '#fbbf24', color: 'black', border: 'none', borderRadius: '12px', fontWeight: 700, marginTop: '20px', cursor: 'pointer' }}>
                                {editingId ? 'Save Changes' : 'Create Ingredient'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
