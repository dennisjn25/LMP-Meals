"use client";

import { useState } from "react";
import { Users, ShoppingBag, DollarSign, ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/customers";

interface Customer {
    id: string;
    name: string | null;
    email: string | null;
    phone?: string | null;
    createdAt: Date;
    deliveryAddress?: string | null;
    deliveryCity?: string | null;
    deliveryState?: string | null;
    deliveryZip?: string | null;
    billingAddress?: string | null;
    billingCity?: string | null;
    billingState?: string | null;
    billingZip?: string | null;
    orders: {
        id: string;
        orderNumber?: string;
        total: number;
        status: string;
        createdAt: Date;
        items: any[];
    }[];
}

interface GuestOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: Date;
    items: any[];
}

export default function AdminCustomerList({ customers, guestOrders }: { customers: Customer[], guestOrders: GuestOrder[] }) {
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'registered' | 'guest'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate metrics
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders?.length || 0), 0) + guestOrders.length;
    const totalRevenue = customers.reduce((sum, c) =>
        sum + (c.orders?.reduce((orderSum, o) => orderSum + o.total, 0) || 0), 0
    ) + guestOrders.reduce((sum, o) => sum + o.total, 0);

    // Combine registered and guest customers
    const registeredCustomers = customers.map(c => ({
        ...c,
        type: 'registered' as const,
        totalSpent: c.orders?.reduce((sum, o) => sum + o.total, 0) || 0,
        orderCount: c.orders?.length || 0
    }));

    const guestCustomers = Object.values(
        guestOrders.reduce((acc, order) => {
            const key = order.customerEmail;
            if (!acc[key]) {
                acc[key] = {
                    id: `guest-${key}`,
                    name: order.customerName,
                    email: order.customerEmail,
                    type: 'guest' as const,
                    createdAt: order.createdAt,
                    orders: [],
                    totalSpent: 0,
                    orderCount: 0
                };
            }
            acc[key].orders.push(order);
            acc[key].totalSpent += order.total;
            acc[key].orderCount += 1;
            return acc;
        }, {} as Record<string, any>)
    );

    const allCustomers = [...registeredCustomers, ...guestCustomers].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const filteredCustomers = allCustomers.filter(c => {
        if (filter === 'all') return true;
        return c.type === filter;
    });

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this customer?")) return;
        setLoading(true);
        const res = await deleteCustomer(id);
        if (res.error) alert(res.error);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const values: any = Object.fromEntries(formData.entries());

        let res;
        if (editingCustomer) {
            res = await updateCustomer(editingCustomer.id, values);
        } else {
            res = await createCustomer(values);
        }

        if (res.error) {
            setError(res.error);
        } else {
            setIsModalOpen(false);
            setEditingCustomer(null);
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Profile Management</h2>
                <button
                    onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}
                    style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                        color: 'black',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    <Plus size={18} /> New Customer
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <StatCard
                    icon={<Users size={28} />}
                    label="Total CRM Entry"
                    value={totalCustomers + guestCustomers.length}
                    color="#fbbf24"
                />
                <StatCard
                    icon={<ShoppingBag size={28} />}
                    label="Lifetime Orders"
                    value={totalOrders}
                    color="#10b981"
                />
                <StatCard
                    icon={<DollarSign size={28} />}
                    label="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    color="#8b5cf6"
                />
            </div>

            {/* Filters */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '24px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '12px'
            }}>
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                    All Profiles
                </FilterButton>
                <FilterButton active={filter === 'registered'} onClick={() => setFilter('registered')}>
                    Registered Owners ({registeredCustomers.length})
                </FilterButton>
                <FilterButton active={filter === 'guest'} onClick={() => setFilter('guest')}>
                    Guest Checkouts ({guestCustomers.length})
                </FilterButton>
            </div>

            {/* Customers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCustomers.map(customer => (
                    <CustomerRow
                        key={customer.id}
                        customer={customer}
                        expanded={expandedCustomer === customer.id}
                        onToggle={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                        onEdit={() => handleEdit(customer)}
                        onDelete={(e: any) => handleDelete(customer.id, e)}
                    />
                ))}
                {filteredCustomers.length === 0 && (
                    <div style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <Users size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No profiles found.</div>
                    </div>
                )}
            </div>

            {/* Customer Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0f172a',
                        width: '100%',
                        maxWidth: '800px',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ padding: '48px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '8px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                                {editingCustomer ? 'Edit' : 'New'} <span style={{ color: '#fbbf24' }}>Profile</span>
                            </h2>
                            <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Fill in the details for the customer account.</p>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</label>
                                    <input name="name" required defaultValue={editingCustomer?.name || ""} style={inputStyle} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</label>
                                    <input name="email" type="email" required defaultValue={editingCustomer?.email || ""} style={inputStyle} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</label>
                                    <input name="phone" defaultValue={editingCustomer?.phone || ""} style={inputStyle} placeholder="123-456-7890" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Password {editingCustomer && '(Leave blank to keep current)'}</label>
                                    <input name="password" type="password" required={!editingCustomer} style={inputStyle} placeholder="••••••••" />
                                </div>

                                <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />

                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Delivery Address</h4>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Street Address</label>
                                    <input name="deliveryAddress" defaultValue={editingCustomer?.deliveryAddress || ""} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>City</label>
                                    <input name="deliveryCity" defaultValue={editingCustomer?.deliveryCity || ""} style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>State</label>
                                        <input name="deliveryState" defaultValue={editingCustomer?.deliveryState || "AZ"} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Zip</label>
                                        <input name="deliveryZip" defaultValue={editingCustomer?.deliveryZip || ""} style={inputStyle} />
                                    </div>
                                </div>

                                {error && <div style={{ gridColumn: 'span 2', color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={loading}
                                        style={{ flex: 2, padding: '16px', background: '#fbbf24', color: 'black', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (editingCustomer ? 'Update Profile' : 'Create Profile')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CustomerRow({ customer, expanded, onToggle, onEdit, onDelete }: any) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div
                onClick={onToggle}
                style={{
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    cursor: 'pointer',
                    background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                    flexWrap: 'wrap'
                }}
            >
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
                        {customer.name || 'Anonymous User'}
                        {customer.type === 'guest' && (
                            <span style={{
                                marginLeft: '12px',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.65rem',
                                background: 'rgba(251, 191, 36, 0.1)',
                                color: '#fbbf24',
                                fontWeight: 800,
                                border: '1px solid rgba(251, 191, 36, 0.2)',
                                verticalAlign: 'middle',
                                letterSpacing: '0.05em'
                            }}>
                                GUEST
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{customer.email}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Order Count</div>
                    <div style={{ fontWeight: 800, color: 'white' }}>{customer.orderCount}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Total Value</div>
                    <div style={{ fontWeight: 800, color: '#fbbf24' }}>${customer.totalSpent.toFixed(2)}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Member Since</div>
                    <div style={{ color: 'white' }}>{new Date(customer.createdAt).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {customer.type !== 'guest' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={onDelete}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                    <div style={{ color: '#94a3b8', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* Expanded Order History */}
            {expanded && customer.orders.length > 0 && (
                <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Order Archive</h4>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        {customer.orders.map((order: any, i: number) => (
                            <div key={order.id} style={{
                                padding: '16px 24px',
                                borderBottom: i === customer.orders.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '2px' }}>
                                        Order #{order.orderNumber || order.id.slice(0, 8)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'white', marginBottom: '4px' }}>${order.total.toFixed(2)}</div>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        background: getStatusColor(order.status) + '15',
                                        color: getStatusColor(order.status),
                                        border: `1px solid ${getStatusColor(order.status)}30`
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
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

const inputStyle = {
    width: '100%',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    fontSize: '1rem'
};

function getStatusColor(status: string) {
    const colors: any = {
        'PENDING': '#fbbf24',
        'PAID': '#3b82f6',
        'COMPLETED': '#10b981',
        'CANCELLED': '#ef4444',
        'DELIVERED': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
}
