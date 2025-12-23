"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart, Calendar } from "lucide-react";

interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: Date;
    items: {
        id: string;
        quantity: number;
        price: number;
        meal: {
            title: string;
            category: string;
        };
    }[];
}

interface Props {
    orders: Order[];
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    totalExpenses: number;
    expenses: any[];
    qbConnected: boolean;
    lastSyncAt: Date | null;
}

export default function AdminFinancesClient({
    orders,
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    totalExpenses,
    expenses,
    qbConnected,
    lastSyncAt
}: Props) {
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ invoices: number, payments: number, expenses: number } | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/admin/quickbooks/sync', { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSyncResult(data);
            setTimeout(() => setSyncResult(null), 10000);
            // Don't reload immediately so user can see sync result
            // window.location.reload(); 
        } catch (err: any) {
            alert("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };


    // Filter orders by timeframe
    const getFilteredOrders = () => {
        const now = new Date();
        const cutoff = new Date();

        switch (timeframe) {
            case 'week':
                cutoff.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoff.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                cutoff.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return orders;
        }

        return orders.filter(o => new Date(o.createdAt) >= cutoff);
    };

    const filteredOrders = getFilteredOrders();
    const filteredRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const filteredPaidRevenue = filteredOrders
        .filter(o => ['PAID', 'COMPLETED', 'DELIVERED'].includes(o.status))
        .reduce((sum, o) => sum + o.total, 0);

    const filteredExpensesList = expenses.filter(e => {
        if (timeframe === 'all') return true;
        const now = new Date();
        const cutoff = new Date();
        if (timeframe === 'week') cutoff.setDate(now.getDate() - 7);
        if (timeframe === 'month') cutoff.setMonth(now.getMonth() - 1);
        if (timeframe === 'year') cutoff.setFullYear(now.getFullYear() - 1);
        return new Date(e.date) >= cutoff;
    });

    const filteredExpenses = filteredExpensesList.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = filteredPaidRevenue - filteredExpenses;

    // Calculate average order value
    const avgOrderValue = filteredOrders.length > 0 ? filteredRevenue / filteredOrders.length : 0;

    // Get top selling meals
    const mealSales = filteredOrders.reduce((acc, order) => {
        order.items.forEach(item => {
            const key = item.meal.title;
            if (!acc[key]) {
                acc[key] = {
                    name: item.meal.title,
                    category: item.meal.category,
                    quantity: 0,
                    revenue: 0
                };
            }
            acc[key].quantity += item.quantity;
            acc[key].revenue += item.price * item.quantity;
        });
        return acc;
    }, {} as Record<string, any>);

    const topMeals = Object.values(mealSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10);

    // Revenue by category
    const categoryRevenue = filteredOrders.reduce((acc, order) => {
        order.items.forEach(item => {
            const category = item.meal.category;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += item.price * item.quantity;
        });
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryRevenue)
        .map(([category, revenue]) => ({ category, revenue }))
        .sort((a, b) => b.revenue - a.revenue);

    // Orders by status
    const statusCounts = filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* QuickBooks Integration Header */}
            <div style={{
                padding: '32px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `6px solid ${qbConnected ? '#10b981' : '#fbbf24'}`,
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: qbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: qbConnected ? '#10b981' : '#fbbf24'
                        }}>
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 900, fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>QuickBooks Enterprise</div>
                            <div style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '2px' }}>
                                {qbConnected
                                    ? `STATUS: CONNECTED • LAST SYNC: ${lastSyncAt ? new Date(lastSyncAt).toLocaleString().toUpperCase() : 'NEVER'}`
                                    : 'STATUS: DISCONNECTED'}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {qbConnected ? (
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                style={{
                                    padding: '14px 28px',
                                    fontSize: '0.85rem',
                                    fontWeight: 900,
                                    fontFamily: 'var(--font-heading)',
                                    letterSpacing: '0.1em',
                                    borderRadius: '12px',
                                    background: isSyncing ? 'rgba(255,255,255,0.05)' : 'white',
                                    color: isSyncing ? '#94a3b8' : 'black',
                                    border: 'none',
                                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {isSyncing ? 'SYNCING...' : 'SYNC DATA'}
                            </button>
                        ) : (
                            <a
                                href="/api/auth/quickbooks/connect"
                                style={{
                                    padding: '14px 28px',
                                    fontSize: '0.85rem',
                                    fontWeight: 900,
                                    fontFamily: 'var(--font-heading)',
                                    letterSpacing: '0.1em',
                                    borderRadius: '12px',
                                    background: '#2ca01c', // QuickBooks Green
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 10px 20px -5px rgba(44, 160, 28, 0.3)'
                                }}
                            >
                                CONNECT QUICKBOOKS
                            </a>
                        )}
                    </div>
                </div>
                {syncResult && (
                    <div style={{ marginTop: '20px', padding: '16px 24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)', letterSpacing: '0.02em' }}>
                        Sync complete: +{syncResult.invoices} invoices, +{syncResult.payments} payments, +{syncResult.expenses} expenses processed.
                    </div>
                )}
            </div>

            {/* Timeframe Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <FilterButton active={timeframe === 'week'} onClick={() => setTimeframe('week')}>
                    Last 7 Days
                </FilterButton>
                <FilterButton active={timeframe === 'month'} onClick={() => setTimeframe('month')}>
                    Last 30 Days
                </FilterButton>
                <FilterButton active={timeframe === 'year'} onClick={() => setTimeframe('year')}>
                    Last Year
                </FilterButton>
                <FilterButton active={timeframe === 'all'} onClick={() => setTimeframe('all')}>
                    All Historical Data
                </FilterButton>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <StatCard
                    icon={<DollarSign size={28} />}
                    label="Total Revenue"
                    value={`$${filteredRevenue.toFixed(2)}`}
                    color="#fbbf24"
                />
                <StatCard
                    icon={<TrendingUp size={28} />}
                    label="Paid Revenue"
                    value={`$${filteredPaidRevenue.toFixed(2)}`}
                    color="#10b981"
                />
                <StatCard
                    icon={<DollarSign size={28} />}
                    label="Expenses"
                    value={`$${filteredExpenses.toFixed(2)}`}
                    color="#ef4444"
                />
                <StatCard
                    icon={<TrendingUp size={28} />}
                    label="Net Profit"
                    value={`$${netProfit.toFixed(2)}`}
                    color={netProfit >= 0 ? "#10b981" : "#ef4444"}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <StatCard
                    icon={<ShoppingCart size={28} />}
                    label="Total Orders"
                    value={filteredOrders.length}
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<Calendar size={28} />}
                    label="Avg. Order Value"
                    value={`$${avgOrderValue.toFixed(2)}`}
                    color="#fbbf24"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
                {/* Top Selling Meals */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Top Selling Meals</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {topMeals.map((meal: any, index) => (
                            <div key={index} style={{
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>{meal.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                        {meal.quantity} SOLD • {meal.category}
                                    </div>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fbbf24' }}>
                                    ${meal.revenue.toFixed(2)}
                                </div>
                            </div>
                        ))}
                        {topMeals.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                No sales data available for this period
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue by Category */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Revenue by Category</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {categoryData.map(({ category, revenue }) => {
                            const percentage = (revenue / filteredRevenue) * 100;
                            return (
                                <div key={category}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-end' }}>
                                        <span style={{ fontWeight: 700, color: 'white', textTransform: 'uppercase', fontSize: '0.9rem' }}>{category}</span>
                                        <span style={{ fontWeight: 800, color: '#fbbf24' }}>${revenue.toFixed(2)}</span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '99px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                                            borderRadius: '99px',
                                            boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
                                        }} />
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', fontWeight: 600 }}>
                                        {percentage.toFixed(1)}% OF REVENUE
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)'
            }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Order Status Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} style={{
                            padding: '24px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{count}</div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: getStatusColor(status),
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                {status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Orders</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                                <th style={tableHeaderStyle}>Order #</th>
                                <th style={tableHeaderStyle}>Date</th>
                                <th style={tableHeaderStyle}>Items</th>
                                <th style={tableHeaderStyle}>Status</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.slice(0, 10).map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>#{order.orderNumber}</td>
                                    <td style={{ padding: '20px 24px', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px 24px', color: 'white', fontWeight: 700 }}>{order.items.length} units</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.65rem',
                                            fontWeight: 900,
                                            background: getStatusColor(order.status) + '15',
                                            color: getStatusColor(order.status),
                                            border: `1px solid ${getStatusColor(order.status)}30`,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 900, color: '#fbbf24', fontSize: '1.1rem' }}>${order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Expenses from QuickBooks */}
            {qbConnected && (
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    marginTop: '16px'
                }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expenses (QuickBooks)</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                                    <th style={tableHeaderStyle}>Description</th>
                                    <th style={tableHeaderStyle}>Date</th>
                                    <th style={tableHeaderStyle}>Category</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpensesList.slice(0, 10).map((expense: any) => (
                                    <tr key={expense.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '20px 24px', fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{expense.description}</td>
                                        <td style={{ padding: '20px 24px', color: '#94a3b8' }}>{new Date(expense.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                background: 'rgba(255,255,255,0.05)',
                                                color: '#e2e8f0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 900, color: '#ef4444', fontSize: '1.1rem' }}>-${expense.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {filteredExpensesList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>No expense records found for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number | string, color: string }) {
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
                padding: '10px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: active ? 'white' : 'transparent',
                color: active ? 'black' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
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

function getStatusColor(status: string) {
    const colors: any = {
        'PENDING': '#fbbf24',
        'PAID': '#3b82f6',
        'COMPLETED': '#10b981',
        'CANCELLED': '#ef4444',
        'DELIVERED': '#8b5cf6'
    };
    return colors[status] || '#64748b';
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '20px 24px',
    fontWeight: 700,
    color: '#94a3b8',
    fontFamily: 'var(--font-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '0.75rem'
};

