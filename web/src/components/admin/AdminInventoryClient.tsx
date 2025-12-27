import { useState } from "react";
import { Package, TrendingUp, TrendingDown, AlertCircle, Utensils, Carrot } from "lucide-react";
import { toggleMealAvailability } from "@/actions/meals";
import AdminIngredientList from "./AdminIngredientList";

interface Meal {
    id: string;
    title: string;
    category: string;
    price: number;
    available: boolean;
    orderItems: {
        id: string;
        quantity: number;
        order: {
            status: string;
            createdAt: Date;
        };
    }[];
}

export default function AdminInventoryClient({ meals, ingredients }: { meals: Meal[], ingredients: any[] }) {
    const [activeTab, setActiveTab] = useState<'MEALS' | 'INGREDIENTS'>('MEALS');
    const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate inventory metrics
    const totalMeals = meals.length;
    const availableMeals = meals.filter(m => m.available).length;
    const unavailableMeals = meals.filter(m => !m.available).length;

    // Calculate total orders for each meal
    const mealsWithStats = meals.map(meal => {
        const totalOrders = meal.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const recentOrders = meal.orderItems.filter(item => {
            const orderDate = new Date(item.order.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
        }).reduce((sum, item) => sum + item.quantity, 0);

        return {
            ...meal,
            totalOrders,
            recentOrders
        };
    });

    // Filter meals
    const filteredMeals = mealsWithStats.filter(meal => {
        const matchesFilter = filter === 'all' ||
            (filter === 'available' && meal.available) ||
            (filter === 'unavailable' && !meal.available);
        const matchesSearch = meal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0px' }}>
                <button
                    onClick={() => setActiveTab('MEALS')}
                    style={{
                        padding: '0 0 16px 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'MEALS' ? '3px solid #fbbf24' : '3px solid transparent',
                        color: activeTab === 'MEALS' ? 'white' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Utensils size={18} /> Meal Availability
                </button>
                <button
                    onClick={() => setActiveTab('INGREDIENTS')}
                    style={{
                        padding: '0 0 16px 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'INGREDIENTS' ? '3px solid #fbbf24' : '3px solid transparent',
                        color: activeTab === 'INGREDIENTS' ? 'white' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Carrot size={18} /> Ingredients & Stock
                </button>
            </div>

            {activeTab === 'MEALS' ? (
                <>
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <StatCard
                            icon={<Package size={28} />}
                            label="Total Meals"
                            value={totalMeals}
                            color="#fbbf24"
                        />
                        <StatCard
                            icon={<TrendingUp size={28} />}
                            label="Available"
                            value={availableMeals}
                            color="#10b981"
                        />
                        <StatCard
                            icon={<TrendingDown size={28} />}
                            label="Unavailable"
                            value={unavailableMeals}
                            color="#ef4444"
                        />
                    </div>

                    {/* Filters */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                            <input
                                type="text"
                                placeholder="Search meals or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                                All
                            </FilterButton>
                            <FilterButton active={filter === 'available'} onClick={() => setFilter('available')}>
                                Available
                            </FilterButton>
                            <FilterButton active={filter === 'unavailable'} onClick={() => setFilter('unavailable')}>
                                Unavailable
                            </FilterButton>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Meal Details</th>
                                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Category</th>
                                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Pricing</th>
                                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Availability</th>
                                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMeals.map((meal) => (
                                    <tr key={meal.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{meal.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ID: {meal.id.slice(0, 8)}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                background: 'rgba(255,255,255,0.05)',
                                                color: '#e2e8f0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {meal.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontWeight: 800, color: '#fbbf24' }}>${meal.price.toFixed(2)}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await toggleMealAvailability(meal.id, !meal.available);
                                                    } catch (error) {
                                                        console.error(error);
                                                        alert("Failed to update availability");
                                                    }
                                                }}
                                                style={{

                                                    cursor: 'pointer',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: meal.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: meal.available ? '#10b981' : '#ef4444',
                                                    border: `1px solid ${meal.available ? '#10b98130' : '#ef444430'}`,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.boxShadow = `0 0 10px ${meal.available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`;
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                title="Click to toggle availability"
                                            >
                                                {meal.available ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ color: 'white', fontWeight: 700 }}>{meal.totalOrders} total</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: meal.recentOrders > 0 ? '#10b981' : '#64748b' }}>
                                                    {meal.recentOrders > 0 && <TrendingUp size={14} />}
                                                    {meal.recentOrders} recent (7d)
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMeals.length === 0 && (
                            <div style={{ padding: '80px 40px', textAlign: 'center', color: '#94a3b8' }}>
                                <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                                <div style={{ fontSize: '1.1rem' }}>No meals found matching your criteria.</div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <AdminIngredientList ingredients={ingredients} />
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
        }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{value}</div>
            </div>
        </div>
    );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: active ? 'white' : 'transparent',
                color: active ? 'black' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}
            onMouseOver={(e) => {
                if (!active) {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
            }}
            onMouseOut={(e) => {
                if (!active) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                }
            }}
        >
            {children}
        </button>
    );
}

