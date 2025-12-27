"use client";

import { useState, useMemo } from "react";
import { Users, ShoppingBag, DollarSign, ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/customers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { tokens } from "@/lib/design-tokens";
import { formatCurrency } from "@/lib/utils";

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

    // Search & Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate metrics
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders?.length || 0), 0) + guestOrders.length;
    const totalRevenue = customers.reduce((sum, c) =>
        sum + (c.orders?.reduce((orderSum, o) => orderSum + o.total, 0) || 0), 0
    ) + guestOrders.reduce((sum, o) => sum + o.total, 0);

    // Combine registered and guest customers
    const registeredCustomers = useMemo(() => customers.map(c => ({
        ...c,
        type: 'registered' as const,
        totalSpent: c.orders?.reduce((sum, o) => sum + o.total, 0) || 0,
        orderCount: c.orders?.length || 0
    })), [customers]);

    const guestCustomers = useMemo(() => Object.values(
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
    ), [guestOrders]);

    const allCustomers = useMemo(() => [...registeredCustomers, ...guestCustomers], [registeredCustomers, guestCustomers]);

    // Derived State: Filtered & Sorted
    const filteredCustomers = useMemo(() => {
        let result = allCustomers;

        // 1. Type Filter
        if (filter !== 'all') {
            result = result.filter(c => c.type === filter);
        }

        // 2. Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
                (c.email && c.email.toLowerCase().includes(lowerQuery))
            );
        }

        // 3. Sort
        result.sort((a, b) => {
            const aValue = (a as any)[sortConfig.key];
            const bValue = (b as any)[sortConfig.key];

            if (aValue === bValue) return 0;
            // Handle dates
            if (sortConfig.key === 'createdAt') {
                return sortConfig.direction === 'asc'
                    ? new Date(aValue).getTime() - new Date(bValue).getTime()
                    : new Date(bValue).getTime() - new Date(aValue).getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [allCustomers, filter, searchQuery, sortConfig]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xl }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>Profile Management</h2>
                <Button
                    onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}
                    variant="primary"
                >
                    <Plus size={18} style={{ marginRight: '8px' }} /> New Customer
                </Button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <StatCard
                    icon={<Users size={28} />}
                    label="Total CRM Entry"
                    value={totalCustomers + guestCustomers.length}
                    color={tokens.colors.accent.DEFAULT}
                />
                <StatCard
                    icon={<ShoppingBag size={28} />}
                    label="Lifetime Orders"
                    value={totalOrders}
                    color={tokens.colors.text.success}
                />
                <StatCard
                    icon={<DollarSign size={28} />}
                    label="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    color="#8b5cf6"
                />
            </div>

            {/* Toolbar */}
            <Card style={{
                display: 'flex', gap: '16px', flexWrap: 'wrap',
                background: tokens.colors.surface.light,
                padding: '24px',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Type Filters */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => { setFilter('all'); setCurrentPage(1); }} style={{ color: filter === 'all' ? 'black' : 'white', borderColor: filter === 'all' ? 'transparent' : tokens.colors.border.dark }}>
                        ALL ({allCustomers.length})
                    </Button>
                    <Button variant={filter === 'registered' ? 'primary' : 'outline'} size="sm" onClick={() => { setFilter('registered'); setCurrentPage(1); }} style={{ color: filter === 'registered' ? 'black' : 'white', borderColor: filter === 'registered' ? 'transparent' : tokens.colors.border.dark }}>
                        REGISTERED ({registeredCustomers.length})
                    </Button>
                    <Button variant={filter === 'guest' ? 'primary' : 'outline'} size="sm" onClick={() => { setFilter('guest'); setCurrentPage(1); }} style={{ color: filter === 'guest' ? 'black' : 'white', borderColor: filter === 'guest' ? 'transparent' : tokens.colors.border.dark }}>
                        GUEST ({guestCustomers.length})
                    </Button>
                </div>

                {/* Search & Sort */}
                <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.text.secondary }} />
                        <Input
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Search name or email..."
                            style={{ paddingLeft: '48px', marginBottom: 0 }}
                        />
                    </div>

                    <div style={{ display: 'flex', background: tokens.colors.surface.medium, borderRadius: tokens.radius.md, padding: '4px', border: `1px solid ${tokens.colors.border.dark}` }}>
                        <button
                            onClick={() => handleSort('createdAt')}
                            style={{ padding: '8px 12px', background: sortConfig?.key === 'createdAt' ? tokens.colors.surface.light : 'transparent', border: 'none', color: 'white', borderRadius: tokens.radius.sm, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            Joined {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('totalSpent')}
                            style={{ padding: '8px 12px', background: sortConfig?.key === 'totalSpent' ? tokens.colors.surface.light : 'transparent', border: 'none', color: 'white', borderRadius: tokens.radius.sm, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            Spent {sortConfig?.key === 'totalSpent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Customers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {paginatedCustomers.map(customer => (
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
                    <Card style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        color: tokens.colors.text.secondary,
                        background: tokens.colors.surface.light
                    }}>
                        <Users size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No profiles found.</div>
                        {searchQuery && <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try adjusting your search criteria.</div>}
                    </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
                        <Button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            style={{ color: 'white', borderColor: tokens.colors.border.dark }}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <span style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                            style={{ color: 'white', borderColor: tokens.colors.border.dark }}
                        >
                            <ChevronRight size={16} />
                        </Button>
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
                    <Card style={{
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        padding: '0',
                        background: '#0f172a'
                    }}>
                        <div style={{ padding: '48px', position: 'relative' }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: tokens.colors.text.secondary, cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '8px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                                {editingCustomer ? 'Edit' : 'New'} <span style={{ color: tokens.colors.accent.DEFAULT }}>Profile</span>
                            </h2>
                            <p style={{ color: tokens.colors.text.secondary, marginBottom: '32px' }}>Fill in the details for the customer account.</p>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Full Name" name="name" required defaultValue={editingCustomer?.name || ""} placeholder="John Doe" />
                                </div>
                                <div>
                                    <Input label="Email Address" name="email" type="email" required defaultValue={editingCustomer?.email || ""} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <Input label="Phone Number" name="phone" defaultValue={editingCustomer?.phone || ""} placeholder="123-456-7890" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label={`Password ${editingCustomer ? '(Leave blank to keep current)' : ''}`} name="password" type="password" required={!editingCustomer} placeholder="••••••••" />
                                </div>

                                <div style={{ gridColumn: 'span 2', height: '1px', background: tokens.colors.border.dark, margin: '12px 0' }} />

                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ color: tokens.colors.accent.DEFAULT, fontSize: '1rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Delivery Address</h4>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Street Address" name="deliveryAddress" defaultValue={editingCustomer?.deliveryAddress || ""} />
                                </div>
                                <div>
                                    <Input label="City" name="deliveryCity" defaultValue={editingCustomer?.deliveryCity || ""} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <Input label="State" name="deliveryState" defaultValue={editingCustomer?.deliveryState || "AZ"} />
                                    </div>
                                    <div>
                                        <Input label="Zip" name="deliveryZip" defaultValue={editingCustomer?.deliveryZip || ""} />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', height: '1px', background: tokens.colors.border.dark, margin: '12px 0' }} />

                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ color: tokens.colors.accent.DEFAULT, fontSize: '1rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Billing Address</h4>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Street Address" name="billingAddress" defaultValue={editingCustomer?.billingAddress || ""} />
                                </div>
                                <div>
                                    <Input label="City" name="billingCity" defaultValue={editingCustomer?.billingCity || ""} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <Input label="State" name="billingState" defaultValue={editingCustomer?.billingState || "AZ"} />
                                    </div>
                                    <div>
                                        <Input label="Zip" name="billingZip" defaultValue={editingCustomer?.billingZip || ""} />
                                    </div>
                                </div>

                                {error && <div style={{ gridColumn: 'span 2', color: tokens.colors.text.error, fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '12px' }}>
                                    <Button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        variant="outline"
                                        fullWidth
                                        style={{ color: 'white', borderColor: tokens.colors.border.dark }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        isLoading={loading}
                                        fullWidth
                                    >
                                        {editingCustomer ? 'Update Profile' : 'Create Profile'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

function CustomerRow({ customer, expanded, onToggle, onEdit, onDelete }: any) {
    return (
        <Card style={{
            padding: 0,
            overflow: 'hidden',
            transition: tokens.transitions.normal,
            background: tokens.colors.surface.light
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
                            <Badge variant="warning" style={{ marginLeft: '12px' }}>GUEST</Badge>
                        )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: tokens.colors.text.secondary }}>{customer.email}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: tokens.colors.text.secondary, textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Order Count</div>
                    <div style={{ fontWeight: 800, color: 'white' }}>{customer.orderCount}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: tokens.colors.text.secondary, textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Total Value</div>
                    <div style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT }}>${customer.totalSpent.toFixed(2)}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: tokens.colors.text.secondary, textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Member Since</div>
                    <div style={{ color: 'white' }}>{new Date(customer.createdAt).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {customer.type !== 'guest' && (
                        <>
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ minWidth: '36px', width: '36px', padding: 0, borderColor: tokens.colors.border.dark, color: '#3b82f6' }}>
                                <Pencil size={16} />
                            </Button>
                            <Button size="sm" variant="danger" onClick={onDelete} style={{ minWidth: '36px', width: '36px', padding: 0 }}>
                                <Trash2 size={16} />
                            </Button>
                        </>
                    )}
                    <div style={{ color: tokens.colors.text.secondary, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* Expanded Order History */}
            {expanded && customer.orders.length > 0 && (
                <div style={{ padding: '32px', borderTop: `1px solid ${tokens.colors.border.dark}`, background: 'rgba(0,0,0,0.2)' }}>
                    <h4 style={{ fontSize: '0.85rem', color: tokens.colors.accent.DEFAULT, textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Order Archive</h4>
                    <div style={{ background: tokens.colors.surface.light, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border.dark}`, overflow: 'hidden' }}>
                        {customer.orders.map((order: any, i: number) => (
                            <div key={order.id} style={{
                                padding: '16px 24px',
                                borderBottom: i === customer.orders.length - 1 ? 'none' : `1px solid ${tokens.colors.border.dark}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '2px' }}>
                                        Order #{order.orderNumber || order.id.slice(0, 8)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: tokens.colors.text.secondary }}>
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'white', marginBottom: '4px' }}>${order.total.toFixed(2)}</div>
                                    <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'warning'}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number | string, color: string }) {
    return (
        <Card style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            background: tokens.colors.surface.light
        }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: tokens.radius.lg,
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.85rem', color: tokens.colors.text.secondary, marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{value}</div>
            </div>
        </Card>
    );
}

