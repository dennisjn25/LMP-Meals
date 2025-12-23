"use client";

import { useState } from "react";
import {
    Navigation,
    CheckCircle2,
    Camera,
    Signature,
    X,
    MapPin,
    Phone,
    ChevronLeft,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { updateDeliveryStatus } from "@/actions/delivery";

export default function RouteDetailClient({ route }: { route: any }) {
    const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
    const [podMode, setPodMode] = useState<'PHOTO' | 'SIGNATURE' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDeliver = async (deliveryId: string) => {
        setLoading(true);
        // In a real app, we'd collect photo/signature here
        const res = await updateDeliveryStatus(deliveryId, "DELIVERED", {
            signedBy: "Customer",
            signatureImage: "data:image/png;base64,mock_signature",
            deliveryPhoto: "data:image/jpeg;base64,mock_photo",
            latitude: 33.4942, // Mock Scottsdale lat
            longitude: -111.9261 // Mock Scottsdale lng
        });

        if (res.success) {
            window.location.reload();
        }
        setLoading(false);
    };

    const openNavigation = (address: string) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Link href="/driver" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#94a3b8',
                textDecoration: 'none',
                marginBottom: '24px'
            }}>
                <ChevronLeft size={20} /> Back to Dashboard
            </Link>

            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Route #{route.id.slice(-4)}</h1>
                <p style={{ color: '#94a3b8' }}>{route.deliveries.length} Stops • {route.status}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {route.deliveries.map((delivery: any, index: number) => (
                    <div key={delivery.id} style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        position: 'relative',
                        opacity: delivery.status === 'DELIVERED' ? 0.6 : 1
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: '-10px',
                            top: '24px',
                            width: '28px',
                            height: '28px',
                            background: delivery.status === 'DELIVERED' ? '#10b981' : 'var(--primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            border: '4px solid #0B0E14'
                        }}>
                            {index + 1}
                        </div>

                        <div style={{ marginLeft: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{delivery.order.customerName}</h3>
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={14} /> {delivery.order.shippingAddress}
                                    </div>
                                </div>
                                {delivery.status === 'DELIVERED' ? (
                                    <CheckCircle2 color="#10b981" />
                                ) : (
                                    <button
                                        onClick={() => openNavigation(delivery.order.shippingAddress)}
                                        style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3b82f6',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Navigation size={18} />
                                    </button>
                                )}
                            </div>

                            {delivery.order.customerPhone && (
                                <a href={`tel:${delivery.order.customerPhone}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    marginBottom: '20px'
                                }}>
                                    <Phone size={14} /> {delivery.order.customerPhone}
                                </a>
                            )}

                            {delivery.status !== 'DELIVERED' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button
                                        onClick={() => setSelectedDelivery(delivery)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid var(--glass-border)',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Camera size={18} /> Proof
                                    </button>
                                    <button
                                        onClick={() => handleDeliver(delivery.id)}
                                        disabled={loading}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {loading ? '...' : <><CheckCircle2 size={18} /> Deliver</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* POD Modal Mockup */}
            {selectedDelivery && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: '#161B22',
                    padding: '32px',
                    borderTopLeftRadius: '32px',
                    borderTopRightRadius: '32px',
                    zIndex: 100,
                    boxShadow: '0 -20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Proof of Delivery</h2>
                        <button onClick={() => setSelectedDelivery(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}><X /></button>
                    </div>

                    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Capture a photo of the package at the door or collect a signature.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '2px dashed var(--glass-border)',
                            height: '150px',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            color: '#94a3b8',
                            cursor: 'pointer'
                        }}>
                            <Camera size={32} />
                            Take Photo
                        </button>

                        <button style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '2px dashed var(--glass-border)',
                            height: '100px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            color: '#94a3b8',
                            cursor: 'pointer'
                        }}>
                            <Signature size={24} />
                            Collect Signature
                        </button>

                        <button
                            onClick={() => handleDeliver(selectedDelivery.id)}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '16px',
                                fontWeight: 700,
                                marginTop: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Complete Delivery
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
