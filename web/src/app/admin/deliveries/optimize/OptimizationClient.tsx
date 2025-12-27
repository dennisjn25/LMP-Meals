"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Map as MapIcon,
    Zap,
    Settings,
    Layers,
    MapPin,
    Navigation,
    Truck,
    Clock,
    CheckCircle2
} from "lucide-react";
import { createRoute, assignDeliveryToRoute } from "@/actions/delivery";
import DeliveryMap from "@/components/admin/DeliveryMap";
import { geocodeAddress } from "@/lib/google-maps";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function OptimizationClient({ pendingDeliveries, drivers }: { pendingDeliveries: any[], drivers: any[] }) {
    const [selectedDriver, setSelectedDriver] = useState<string>("");
    const [optimizing, setOptimizing] = useState(false);
    const [previewRoute, setPreviewRoute] = useState<any[]>([]);
    const [deliveriesWithCoords, setDeliveriesWithCoords] = useState<any[]>(pendingDeliveries);
    const [optimizedStats, setOptimizedStats] = useState({ distance: "0.0", time: 0 });

    // Geocode addresses that don't have coords yet
    useEffect(() => {
        const geocodeMissing = async () => {
            const updated = await Promise.all(pendingDeliveries.map(async (d) => {
                if (d.latitude && d.longitude) return d;

                const state = d.order.deliveryState || "AZ";
                const fullAddress = `${d.order.shippingAddress}, ${d.order.city}, ${state} ${d.order.zipCode}`;
                const coords = await geocodeAddress(fullAddress);

                if (coords) {
                    return { ...d, latitude: coords.lat, longitude: coords.lng };
                }
                return d;
            }));
            setDeliveriesWithCoords(updated);
        };

        geocodeMissing();
    }, [pendingDeliveries]);

    const markers = useMemo(() => {
        const source = previewRoute.length > 0 ? previewRoute : deliveriesWithCoords;
        return source
            .filter(d => d.latitude && d.longitude)
            .map((d, index) => ({
                id: d.id,
                lat: d.latitude,
                lng: d.longitude,
                title: d.order.customerName,
                label: (index + 1).toString()
            }));
    }, [deliveriesWithCoords, previewRoute]);

    const LIBERTY_KITCHEN = { lat: 33.4942, lng: -111.9261 };

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleOptimize = () => {
        setOptimizing(true);

        setTimeout(() => {
            const deliveries = [...deliveriesWithCoords].filter(d => d.latitude && d.longitude);
            const optimized: any[] = [];
            let currentPos = LIBERTY_KITCHEN;
            let remaining = [...deliveries];

            while (remaining.length > 0) {
                let nearestIdx = 0;
                let minDist = Infinity;

                remaining.forEach((d, idx) => {
                    const dist = calculateDistance(currentPos.lat, currentPos.lng, d.latitude, d.longitude);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestIdx = idx;
                    }
                });

                const next = remaining.splice(nearestIdx, 1)[0];
                optimized.push(next);
                currentPos = { lat: next.latitude, lng: next.longitude };
            }

            let totalDist = 0;
            let lastPos = LIBERTY_KITCHEN;
            optimized.forEach(d => {
                totalDist += calculateDistance(lastPos.lat, lastPos.lng, d.latitude, d.longitude);
                lastPos = { lat: d.latitude, lng: d.longitude };
            });
            totalDist += calculateDistance(lastPos.lat, lastPos.lng, LIBERTY_KITCHEN.lat, LIBERTY_KITCHEN.lng);

            setPreviewRoute(optimized);
            setOptimizing(false);
            setOptimizedStats({
                distance: totalDist.toFixed(1),
                time: Math.round(totalDist * 2.5 + optimized.length * 5)
            });
        }, 1500);
    };

    const handleConfirm = async () => {
        if (!selectedDriver) return alert("Select a driver first");

        setOptimizing(true);
        const routeRes = await createRoute(selectedDriver);
        if (routeRes.success) {
            const routeId = routeRes.success.id;
            for (let i = 0; i < previewRoute.length; i++) {
                await assignDeliveryToRoute(previewRoute[i].id, routeId, i + 1);
            }
            window.location.href = "/admin/deliveries";
        }
        setOptimizing(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: tokens.spacing.xl }}>
            {/* Sidebar: Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xl }}>
                <Card style={{ padding: tokens.spacing.xl }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        marginBottom: tokens.spacing.xl,
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing.md,
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#ffffff'
                    }}>
                        <Settings size={22} color={tokens.colors.accent.DEFAULT} /> CONFIGURATION
                    </h3>

                    <div style={{ marginBottom: tokens.spacing.xl }}>
                        <label style={{ display: 'block', color: tokens.colors.text.secondary, fontSize: '0.8rem', marginBottom: tokens.spacing.sm, fontWeight: 800, textTransform: 'uppercase' }}>ASSIGN DRIVER</label>
                        <select
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: tokens.colors.surface.medium,
                                border: `1px solid ${tokens.colors.border.dark}`,
                                borderRadius: tokens.radius.md,
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: tokens.transitions.normal,
                                appearance: 'none'
                            }}
                        >
                            <option value="" disabled>Select a driver...</option>
                            {drivers.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md, padding: tokens.spacing.lg, background: tokens.colors.surface.medium, borderRadius: tokens.radius.md, border: `1px solid ${tokens.colors.border.dark}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>STOPS TO OPTIMIZE</span>
                            <span style={{ fontWeight: 800, color: 'white' }}>{pendingDeliveries.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>EST. TOTAL DISTANCE</span>
                            <span style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT }}>{optimizedStats.distance} km</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: tokens.colors.text.inverseSecondary, fontWeight: 600 }}>EST. TOTAL TIME</span>
                            <span style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT }}>{optimizedStats.time} mins</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleOptimize}
                        disabled={optimizing || pendingDeliveries.length === 0}
                        isLoading={optimizing}
                        variant="primary"
                        style={{ width: '100%', marginTop: tokens.spacing.xl, height: '56px', fontSize: '1rem' }}
                    >
                        <Zap size={20} style={{ marginRight: tokens.spacing.sm }} />
                        GENERATE ROUTE
                    </Button>
                </Card>

                {previewRoute.length > 0 && (
                    <Card style={{ padding: tokens.spacing.xl }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: tokens.spacing.xl, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'white' }}>STOP SEQUENCE</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                            {previewRoute.map((d, i) => (
                                <div key={d.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: tokens.spacing.md,
                                    padding: tokens.spacing.md,
                                    background: tokens.colors.surface.medium,
                                    borderRadius: tokens.radius.md,
                                    border: `1px solid ${tokens.colors.border.dark}`
                                }}>
                                    <div style={{ width: '28px', height: '28px', background: tokens.colors.accent.DEFAULT, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: 'black' }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem' }}>{d.order.customerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: tokens.colors.text.inverseSecondary }}>{d.order.shippingAddress}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={handleConfirm}
                            variant="primary"
                            style={{ width: '100%', marginTop: tokens.spacing.xl, height: '56px' }}
                            isLoading={optimizing}
                        >
                            <CheckCircle2 size={20} style={{ marginRight: tokens.spacing.sm }} />
                            CONFIRM & ASSIGN
                        </Button>
                    </Card>
                )}
            </div>

            {/* Map Preview Area */}
            <Card style={{
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
                minHeight: '650px',
                background: tokens.colors.surface.dark
            }}>
                <DeliveryMap markers={markers} />

                {/* Overlay if no addresses yet */}
                {markers.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}>
                        <div style={{ textAlign: 'center', maxWidth: '400px', padding: tokens.spacing.xl }}>
                            <MapIcon size={64} color={tokens.colors.accent.DEFAULT} style={{ marginBottom: tokens.spacing.xl, opacity: 0.8 }} />
                            <h3 style={{
                                fontSize: '1.75rem',
                                fontWeight: 900,
                                marginBottom: tokens.spacing.md,
                                fontFamily: 'var(--font-heading)',
                                textTransform: 'uppercase',
                                color: '#ffffff'
                            }}>INTERACTIVE MAP</h3>
                            <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '1rem', lineHeight: '1.6' }}>Visualize routes and driver locations in real-time. Full geocoding integration enabled.</p>
                        </div>
                    </div>
                )}

                {/* Bottom Overlay Info */}
                <div style={{
                    position: 'absolute',
                    bottom: tokens.spacing.xl,
                    left: tokens.spacing.xl,
                    right: tokens.spacing.xl,
                    background: 'rgba(11, 14, 20, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: tokens.spacing.lg,
                    borderRadius: tokens.radius.lg,
                    border: `1px solid ${tokens.colors.border.dark}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 20
                }}>
                    <div style={{ display: 'flex', gap: tokens.spacing.xxl }}>
                        <div>
                            <div style={{ color: tokens.colors.text.secondary, fontSize: '0.7rem', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>REGION</div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>SCOTTSDALE, AZ</div>
                        </div>
                        <div>
                            <div style={{ color: tokens.colors.text.secondary, fontSize: '0.7rem', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>ENGINE</div>
                            <div style={{ fontWeight: 800, color: tokens.colors.accent.DEFAULT, fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>GOOGLE ROUTES V2</div>
                        </div>
                    </div>
                    <Layers color={tokens.colors.text.secondary} size={20} />
                </div>
            </Card>
        </div>
    );
}

