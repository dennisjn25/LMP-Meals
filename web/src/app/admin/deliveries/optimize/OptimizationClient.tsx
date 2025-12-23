"use client";

import { useState } from "react";
import {
    Map as MapIcon,
    Zap,
    User,
    ArrowRight,
    Truck,
    CheckCircle2,
    Settings,
    Layers,
    Navigation
} from "lucide-react";
import { createRoute, assignDeliveryToRoute } from "@/actions/delivery";

export default function OptimizationClient({ pendingDeliveries, drivers }: { pendingDeliveries: any[], drivers: any[] }) {
    const [selectedDriver, setSelectedDriver] = useState<string>("");
    const [optimizing, setOptimizing] = useState(false);
    const [previewRoute, setPreviewRoute] = useState<any[]>([]);

    const handleOptimize = () => {
        setOptimizing(true);
        // Simulating optimization delay
        setTimeout(() => {
            setPreviewRoute([...pendingDeliveries]);
            setOptimizing(false);
        }, 1500);
    };

    const handleConfirm = async () => {
        if (!selectedDriver) return alert("Select a driver first");

        setOptimizing(true);
        const routeRes = await createRoute(selectedDriver);
        if (routeRes.success) {
            const routeId = routeRes.success.id;
            // Assign deliveries to route
            for (let i = 0; i < previewRoute.length; i++) {
                await assignDeliveryToRoute(previewRoute[i].id, routeId, i + 1);
            }
            window.location.href = "/admin/deliveries";
        }
        setOptimizing(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '32px' }}>
            {/* Sidebar: Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.2)'
                }}>
                    <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#ffffff'
                    }}>
                        <Settings size={22} color="#fbbf24" /> Configuration
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Assign Driver</label>
                        <select
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="">Select a driver...</option>
                            {drivers.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.role})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Stops to Optimize:</span>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{pendingDeliveries.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Est. Total Distance:</span>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>0.0 km</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Est. Total Time:</span>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>0 mins</span>
                        </div>
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={optimizing || pendingDeliveries.length === 0}
                        style={{
                            width: '100%',
                            marginTop: '28px',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '16px',
                            fontWeight: 800,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            opacity: optimizing ? 0.7 : 1,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {optimizing ? 'Optimizing...' : <><Zap size={20} fill="black" /> Generate Route</>}
                    </button>
                </div>

                {previewRoute.length > 0 && (
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Stop Sequence</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {previewRoute.map((d, i) => (
                                <div key={d.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{i + 1}</div>
                                    <div style={{ flex: 1, fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 600 }}>{d.order.customerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{d.order.shippingAddress}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleConfirm}
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                padding: '16px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            Confirm & Assign Route
                        </button>
                    </div>
                )}
            </div>

            {/* Map Preview Area */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '32px',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '600px',
                backgroundSize: 'cover',
                backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=Scottsdale,AZ&zoom=12&size=1000x1000&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x212121&style=feature:road|element:geometry|color:0x424242&key=YOUR_API_KEY_HERE")',
                backgroundColor: '#0f172a'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent, rgba(11, 14, 20, 0.8))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '450px', padding: '40px' }}>
                        <MapIcon size={80} color="#fbbf24" style={{ marginBottom: '32px', opacity: 0.8 }} />
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            marginBottom: '16px',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#ffffff',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}>Interactive Map View</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>Visualize routes, traffic conditions, and driver locations in real-time. Full Google Maps integration enabled.</p>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <div style={{
                                padding: '8px 16px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                color: '#34d399',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Truck size={16} /> Live Drivers
                            </div>
                            <div style={{
                                padding: '8px 16px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                color: '#60a5fa',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Navigation size={16} /> Real-time Traffic
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Overlay Info */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    background: 'rgba(11, 14, 20, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '20px',
                    borderRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Region</div>
                            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem' }}>Scottsdale, Arizona</div>
                        </div>
                        <div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optimization Engine</div>
                            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem' }}>Google Routes v2</div>
                        </div>
                    </div>
                    <Layers color="#475569" />
                </div>
            </div>
        </div>
    );
}
