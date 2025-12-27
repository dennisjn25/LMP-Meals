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
    BarChart3,
    Zap,
    ChevronDown,
    RefreshCw
} from "lucide-react";
import { createRoute } from "@/actions/delivery";
import { createMissingDeliveries } from "@/actions/sync-deliveries";
import DeliveryMap from "@/components/admin/DeliveryMap";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

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
            window.location.reload();
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xl }}>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: tokens.spacing.lg }}>
                <StatCard
                    icon={<Clock size={24} />}
                    label="Pending"
                    value={stats.pending}
                    color={tokens.colors.accent.DEFAULT}
                />
                <StatCard
                    icon={<Truck size={24} />}
                    label="In Progress"
                    value={stats.inProgress}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<CheckCircle2 size={24} />}
                    label="Delivered"
                    value={stats.delivered}
                    color={tokens.colors.text.success}
                />
                <StatCard
                    icon={<AlertCircle size={24} />}
                    label="Failed"
                    value={stats.failed}
                    color={tokens.colors.text.error}
                />
            </div>

            {/* Actions Bar */}
            <Card style={{ padding: tokens.spacing.md }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: tokens.spacing.md
                }}>
                    <div style={{ display: 'flex', gap: tokens.spacing.md, flex: 1, minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.text.secondary, zIndex: 1 }} size={18} />
                            <Input
                                placeholder="Search orders, customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px', marginBottom: 0 }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Button
                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                variant="outline"
                                style={{ color: 'white', borderColor: tokens.colors.border.dark, minWidth: '160px' }}
                            >
                                {statusFilter === 'ALL' ? 'All Statuses' : statusFilter.replace('_', ' ')}
                                <ChevronDown size={16} style={{ marginLeft: tokens.spacing.sm, opacity: 0.5 }} />
                            </Button>

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
                                        background: tokens.colors.surface.dark,
                                        border: `1px solid ${tokens.colors.border.dark}`,
                                        borderRadius: tokens.radius.md,
                                        padding: '4px',
                                        zIndex: 50,
                                        boxShadow: tokens.shadows.lg,
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
                                                    borderRadius: tokens.radius.sm,
                                                    background: statusFilter === option.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    color: statusFilter === option.value ? 'white' : tokens.colors.text.secondary,
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    fontSize: '0.9rem',
                                                    fontFamily: 'inherit',
                                                    transition: tokens.transitions.normal,
                                                    fontWeight: statusFilter === option.value ? 600 : 400
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

                    <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                        <div style={{ display: 'flex', background: tokens.colors.surface.medium, borderRadius: tokens.radius.md, padding: '4px', border: `1px solid ${tokens.colors.border.dark}` }}>
                            <Button
                                onClick={() => setViewMode('LIST')}
                                variant={viewMode === 'LIST' ? 'primary' : 'ghost'}
                                size="sm"
                                style={{ borderRadius: tokens.radius.sm }}
                            >
                                LIST
                            </Button>
                            <Button
                                onClick={() => setViewMode('MAP')}
                                variant={viewMode === 'MAP' ? 'primary' : 'ghost'}
                                size="sm"
                                style={{ borderRadius: tokens.radius.sm }}
                            >
                                MAP
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSync}
                            isLoading={loading}
                            style={{ color: tokens.colors.accent.DEFAULT, borderColor: tokens.colors.accent.DEFAULT }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = tokens.colors.accent.DEFAULT;
                                e.currentTarget.style.background = `${tokens.colors.accent.DEFAULT}15`;
                                e.currentTarget.style.color = tokens.colors.accent.DEFAULT;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = tokens.colors.accent.DEFAULT;
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = tokens.colors.accent.DEFAULT;
                            }}
                        >
                            <RefreshCw size={16} style={{ marginRight: tokens.spacing.xs }} />
                            Sync
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleCreateRoute}
                            isLoading={loading}
                            style={{ background: tokens.colors.accent.DEFAULT, borderColor: tokens.colors.accent.DEFAULT, color: '#000000' }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = tokens.colors.accent.hover;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(251, 191, 36, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = tokens.colors.accent.DEFAULT;
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Plus size={16} style={{ marginRight: tokens.spacing.xs }} />
                            New Route
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Deliveries Content (Table or Map) */}
            {viewMode === 'LIST' ? (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${tokens.colors.border.dark}`, background: tokens.colors.surface.medium }}>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Order</th>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Customer</th>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Address</th>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Status</th>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Driver / Route</th>
                                    <th style={{ padding: '20px 24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeliveries.length > 0 ? filteredDeliveries.map((delivery) => (
                                    <tr key={delivery.id} style={{ borderBottom: `1px solid ${tokens.colors.border.dark}`, transition: tokens.transitions.normal }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT, fontFamily: 'var(--font-heading)' }}>{delivery.order.orderNumber}</div>
                                            <div style={{ fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary }}>{new Date(delivery.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 700, color: 'white' }}>{delivery.order.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary }}>{delivery.order.customerEmail}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: '300px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tokens.colors.text.inverseSecondary }}>
                                                <MapPin size={14} style={{ flexShrink: 0, color: tokens.colors.accent.DEFAULT }} />
                                                <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{delivery.order.shippingAddress}, {delivery.order.city}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <StatusBadge status={delivery.status} />
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            {delivery.driver ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', height: '24px', background: tokens.colors.surface.medium, border: `1px solid ${tokens.colors.border.dark}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: tokens.colors.accent.DEFAULT }}>{delivery.driver.name?.[0] || 'D'}</div>
                                                    <span style={{ fontSize: '0.9rem', color: 'white' }}>{delivery.driver.name}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem', fontStyle: 'italic' }}>Unassigned</span>
                                            )}
                                            {delivery.route && (
                                                <div style={{ fontSize: '0.75rem', color: tokens.colors.accent.DEFAULT, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                                    <RouteIcon size={12} /> Route #{delivery.route.id.slice(-4)}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <Button size="sm" variant="ghost" style={{ padding: '8px' }}>
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '100px 24px', textAlign: 'center', color: tokens.colors.text.secondary }}>
                                            <Truck size={64} style={{ marginBottom: tokens.spacing.lg, opacity: 0.1, color: tokens.colors.accent.DEFAULT, margin: '0 auto' }} />
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>NO DELIVERIES FOUND</div>
                                            <p style={{ marginTop: tokens.spacing.xs }}>Try syncing orders or adjusting your filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <Card style={{
                    padding: 0,
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
                            <MapPin size={48} color={tokens.colors.accent.DEFAULT} style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>NO COORDINATES FOUND</h3>
                            <p style={{ color: tokens.colors.text.inverseSecondary, maxWidth: '400px' }}>
                                None of the currently filtered deliveries have valid coordinates. Try syncing orders or checking addresses.
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <Card style={{
            padding: tokens.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.lg,
            background: tokens.colors.surface.medium
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: tokens.radius.md,
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.8rem', color: tokens.colors.text.inverseSecondary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{value}</div>
            </div>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "outline" | "warning" | "success" | "error" | "default"> = {
        PENDING: "outline",
        IN_PROGRESS: "warning",
        DELIVERED: "success",
        FAILED: "error",
    };

    const variant = variants[status] || "default";

    return (
        <Badge variant={variant as any} style={variant === "outline" ? { borderColor: tokens.colors.border.dark, color: tokens.colors.text.secondary } : {}}>
            {status.replace('_', ' ')}
        </Badge>
    );
}


