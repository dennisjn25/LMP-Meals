"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Truck, MapPin, Calendar, User as UserIcon, CheckCircle, Clock, AlertCircle, Zap } from "lucide-react";
import { assignDriver, updateDeliveryStatus } from "@/actions/delivery";
import { toast } from "sonner";
import { geocodeAddress } from "@/lib/google-maps";

interface Delivery {
    id: string;
    status: string;
    estimatedArrival: string | Date | null;
    order: {
        id: string;
        orderNumber: string;
        customerName: string;
        shippingAddress: string;
        city: string;
        zipCode: string;
    };
    driver: {
        id: string;
        name: string | null;
    } | null;
}

interface Driver {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
}

export default function DeliveryDashboard({
    initialDeliveries,
    drivers
}: {
    initialDeliveries: Delivery[],
    drivers: Driver[]
}) {
    const [deliveries, setDeliveries] = useState(initialDeliveries);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Derived state
    const unassignedCount = deliveries.filter(d => !d.driver).length;
    const activeCount = deliveries.filter(d => d.status === 'IN_PROGRESS').length;
    const completedCount = deliveries.filter(d => d.status === 'DELIVERED').length;

    const handleAssignDriver = async (deliveryId: string, driverId: string) => {
        try {
            await assignDriver(deliveryId, driverId || null);
            setDeliveries(prev => prev.map(d => {
                if (d.id === deliveryId) {
                    const driver = drivers.find(dr => dr.id === driverId);
                    return {
                        ...d,
                        driver: driver ? { id: driver.id, name: driver.name } : null,
                        status: driverId ? "IN_PROGRESS" : "PENDING"
                    };
                }
                return d;
            }));
            toast.success("Driver assigned");
        } catch (error) {
            toast.error("Failed to assign driver");
        }
    };

    const handleStatusChange = async (deliveryId: string, status: string) => {
        try {
            await updateDeliveryStatus(deliveryId, status);
            setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, status } : d));
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <StatCard icon={<AlertCircle size={24} />} label="Unassigned" value={unassignedCount} color="#fbbf24" />
                <StatCard icon={<Truck size={24} />} label="In Progress" value={activeCount} color="#3b82f6" />
                <StatCard icon={<CheckCircle size={24} />} label="Delivered" value={completedCount} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
                {/* Main List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}> Deliveries</h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <a
                                href="/admin/deliveries/optimize"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                                    color: 'black',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Zap size={16} /> Optimize Routes
                            </a>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    color: 'white'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {deliveries.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                                No deliveries found for this date.
                            </div>
                        ) : (
                            deliveries.map(delivery => (
                                <div key={delivery.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '20px',
                                    display: 'grid',
                                    gridTemplateColumns: '3fr 2fr 2fr',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}>
                                    {/* Order Info */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 700, color: 'white' }}>{delivery.order.customerName}</span>
                                            <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>{delivery.order.orderNumber}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                            <MapPin size={14} />
                                            {delivery.order.shippingAddress}, {delivery.order.city} {delivery.order.zipCode}
                                        </div>
                                    </div>

                                    {/* Driver Assignment */}
                                    <div>
                                        <select
                                            value={delivery.driver?.id || ""}
                                            onChange={(e) => handleAssignDriver(delivery.id, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                background: delivery.driver ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                                border: delivery.driver ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                                color: 'white',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">-- Assign Driver --</option>
                                            {drivers.map(d => (
                                                <option key={d.id} value={d.id}>{d.name || d.email}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status & Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                                        <select
                                            value={delivery.status}
                                            onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                border: 'none',
                                                background: getStatusColor(delivery.status).bg,
                                                color: getStatusColor(delivery.status).text,
                                                cursor: 'pointer',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="FAILED">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar / Map Placeholder */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '24px',
                    height: 'fit-content'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} /> Route Map
                    </h3>
                    <div style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        background: '#1e293b',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        border: '2px dashed rgba(255,255,255,0.1)'
                    }}>
                        Map View (Coming Soon)
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserIcon size={16} /> Active Drivers
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {drivers.map(driver => (
                                <div key={driver.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                                        {driver.name ? driver.name[0] : 'D'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{driver.name || 'Unnamed Driver'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>0 active deliveries</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'DELIVERED': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
        case 'IN_PROGRESS': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
        case 'FAILED': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
        default: return { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' };
    }
};

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
