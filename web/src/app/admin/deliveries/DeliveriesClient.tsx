"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Truck,
    Clock,
    CheckCircle2,
    AlertCircle,
    MapPin,
    User,
    Route as RouteIcon,
    Plus,
    ChevronRight,
    Filter,
    MoreVertical,
    Navigation,
    BarChart3,
    Zap,
    ChevronDown
} from "lucide-react";
import { updateDeliveryStatus, createRoute, assignDeliveryToRoute } from "@/actions/delivery";
import { createMissingDeliveries } from "@/actions/sync-deliveries";
import DeliveryMap from "@/components/admin/DeliveryMap";

interface DeliveriesClientProps {
    initialDeliveries: any[];
    initialRoutes: any[];
    drivers: any[];
}

export default function DeliveriesClient({
    initialDeliveries,
    initialRoutes,
    drivers
}: DeliveriesClientProps) {
    const [deliveries, setDeliveries] = useState(initialDeliveries);
    const [routes, setRoutes] = useState(initialRoutes);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

    const filteredDeliveries = deliveries.filter(d => {
        const matchesSearch =
            d.order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        pending: deliveries.filter(d => d.status === "PENDING").length,
        inProgress: deliveries.filter(d => d.status === "IN_PROGRESS").length,
        delivered: deliveries.filter(d => d.status === "DELIVERED").length,
        failed: deliveries.filter(d => d.status === "FAILED").length,
    };

    const markers = useMemo(() => {
        return filteredDeliveries
            .filter(d => d.latitude && d.longitude)
            .map(d => ({
                id: d.id,
                lat: d.latitude,
                lng: d.longitude,
                title: `${d.order.customerName} (${d.order.orderNumber})`,
                label: d.order.customerName[0]
            }));
    }, [filteredDeliveries]);

    const handleSync = async () => {
        setLoading(true);
        const res = await createMissingDeliveries();
        if (res.count > 0) {
            window.location.reload(); // Simple refresh for now
        }
        setLoading(false);
    };

    const handleCreateRoute = async () => {
        setLoading(true);
        const res = await createRoute();
        if (res.success) {
            window.location.reload();
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard
                    icon={<Clock size={28} color="#fbbf24" />}
                    label="Pending"
                    value={stats.pending}
                    color="#fbbf24"
                />
                <StatCard
                    icon={<Truck size={28} color="#3b82f6" />}
                    label="In Progress"
                    value={stats.inProgress}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<CheckCircle2 size={28} color="#10b981" />}
                    label="Delivered"
                    value={stats.delivered}
                    color="#10b981"
                />
                <StatCard
                    icon={<AlertCircle size={28} color="#ef4444" />}
                    label="Failed"
                    value={stats.failed}
                    color="#ef4444"
                />
            </div>

            {/* Actions Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--card-bg)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search orders, customers, or addresses..."
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
                    <div style={{ position: 'relative', minWidth: '200px' }}>
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontFamily: 'inherit'
                            }}
                        >
                            <span>
                                {statusFilter === 'ALL' && 'All Statuses'}
                                {statusFilter === 'PENDING' && 'Pending'}
                                {statusFilter === 'IN_PROGRESS' && 'In Progress'}
                                {statusFilter === 'DELIVERED' && 'Delivered'}
                                {statusFilter === 'FAILED' && 'Failed'}
                            </span>
                            <ChevronDown size={16} style={{ opacity: 0.5 }} />
                        </button>

                        {isStatusDropdownOpen && (
                            <>
                                <div
                                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                                    onClick={() => setIsStatusDropdownOpen(false)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    left: 0,
                                    width: '100%',
                                    background: '#0f172a', // Slate-900 or similar dark bg
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '6px',
                                    zIndex: 50,
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                }}>
                                    {[
                                        { value: 'ALL', label: 'All Statuses' },
                                        { value: 'PENDING', label: 'Pending' },
                                        { value: 'IN_PROGRESS', label: 'In Progress' },
                                        { value: 'DELIVERED', label: 'Delivered' },
                                        { value: 'FAILED', label: 'Failed' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setStatusFilter(option.value);
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            style={{
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                background: statusFilter === option.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                color: statusFilter === option.value ? 'white' : '#94a3b8',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                border: 'none',
                                                fontSize: '0.9rem',
                                                fontFamily: 'inherit',
                                                transition: 'all 0.2s',
                                                fontWeight: statusFilter === option.value ? 600 : 400
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = statusFilter === option.value ? 'rgba(255,255,255,0.1)' : 'transparent';
                                                e.currentTarget.style.color = statusFilter === option.value ? 'white' : '#94a3b8';
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
                    <button
                        onClick={() => setViewMode('LIST')}
                        style={{
                            padding: '12px 16px',
                            background: viewMode === 'LIST' ? '#fbbf24' : 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: viewMode === 'LIST' ? '#000' : 'white',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        LIST
                    </button>
                    <button
                        onClick={() => setViewMode('MAP')}
                        style={{
                            padding: '12px 16px',
                            background: viewMode === 'MAP' ? '#fbbf24' : 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: viewMode === 'MAP' ? '#000' : 'white',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        MAP
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => window.location.href = '/admin/deliveries/reports'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <BarChart3 size={18} />
                        Reports
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/deliveries/optimize'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '12px',
                            color: '#60a5fa',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Zap size={18} />
                        Optimize
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Clock size={18} />
                        Sync Orders
                    </button>
                    <button
                        onClick={handleCreateRoute}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
                            border: '2px solid #fbbf24',
                            borderRadius: '12px',
                            color: '#fbbf24',
                            fontWeight: 800,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 15px rgba(251, 191, 36, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(251, 191, 36, 0.2)';
                        }}
                    >
                        <Plus size={18} />
                        Create Route
                    </button>
                </div>
            </div>

            {/* Deliveries Content (Table or Map) */}
            {viewMode === 'LIST' ? (
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</th>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Driver / Route</th>
                                <th style={{ padding: '20px 24px', fontWeight: 700, color: '#f8f9fa', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.length > 0 ? filteredDeliveries.map((delivery) => (
                                <tr key={delivery.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 700, color: '#fbbf24' }}>{delivery.order.orderNumber}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{new Date(delivery.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 600, color: 'white' }}>{delivery.order.customerName}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{delivery.order.customerEmail}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', maxWidth: '300px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                                            <MapPin size={14} style={{ flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.9rem' }}>{delivery.order.shippingAddress}, {delivery.order.city}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <StatusBadge status={delivery.status} />
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        {delivery.driver ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{delivery.driver.name?.[0] || 'D'}</div>
                                                <span style={{ fontSize: '0.9rem' }}>{delivery.driver.name}</span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>Unassigned</span>
                                        )}
                                        {delivery.route && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <RouteIcon size={12} /> Route #{delivery.route.id.slice(-4)}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                title="View Details"
                                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <button
                                                title="Assign"
                                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                                            >
                                                <User size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '80px 60px', textAlign: 'center', color: '#cbd5e1' }}>
                                        <Truck size={64} style={{ marginBottom: '24px', opacity: 0.2, color: '#fbbf24' }} />
                                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No deliveries found. Sync orders to get started.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    height: '700px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <DeliveryMap markers={markers} />
                    {markers.length === 0 && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: 'white',
                            textAlign: 'center',
                            padding: '40px',
                            zIndex: 10
                        }}>
                            <MapPin size={48} color="#fbbf24" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>No Deliveries Pinpointed</h3>
                            <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
                                None of the currently filtered deliveries have valid coordinates. Try syncing orders or checking addresses.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <div style={{
            background: 'var(--card-bg)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
        }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.95rem', color: '#e2e8f0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{value}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        PENDING: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
        IN_PROGRESS: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
        DELIVERED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
        FAILED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    };

    const config = colors[status] || colors.PENDING;

    return (
        <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            background: config.bg,
            color: config.text,
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em'
        }}>
            {status}
        </span>
    );
}
