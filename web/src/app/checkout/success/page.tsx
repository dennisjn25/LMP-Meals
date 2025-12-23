"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, Loader2, Printer } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { getOrderDetails } from "@/actions/orders";

function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const data = await getOrderDetails(orderId);
                    setOrder(data);
                    clearCart();
                } catch (error) {
                    console.error("Failed to fetch order", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, clearCart]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="#10b981" />
                <p style={{ marginTop: '20px', color: '#64748b' }}>Confirming your order...</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}>
                <CheckCircle2 size={48} color="#fff" />
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#000' }}>Payment Successful!</h1>

            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Thank you for your order! Your payment has been processed successfully.<br />
                We've sent a confirmation email with your receipt and order details.
            </p>

            {order && (
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', marginBottom: '32px', textAlign: 'left', fontSize: '0.95rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Order Number</div>
                            <div style={{ fontWeight: 600 }}>{order.orderNumber}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Date</div>
                            <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Transaction ID</span>
                            <span style={{ fontFamily: 'monospace' }}>{order.squarePaymentId || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Payment Method</span>
                            <span>{order.paymentMethodBrand} •••• {order.paymentMethodLast4}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, marginTop: '16px' }}>
                            <span>Total Amount</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, textAlign: 'center' }}>
                        Payment is processed by: Intuit Payments Inc., 2700 Coast View, CA 94043, Phon number 1-888-536-4801, NMLS #1098819
                    </p>
                </div>
            )}

            <div className="success-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/" className="btn-black" style={{ padding: '14px 32px' }}>
                    Return Home
                </a>
                <a href="/menu" style={{
                    padding: '14px 32px',
                    border: '2px solid #000',
                    color: '#000',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}>
                    Browse Menu
                </a>
                <button
                    onClick={handlePrint}
                    style={{
                        padding: '14px 32px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: 'transparent',
                        color: '#64748b',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Printer size={18} />
                    Print Receipt
                </button>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center', maxWidth: '700px' }}>
                <Suspense fallback={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 className="animate-spin" size={48} color="#10b981" />
                    </div>
                }>
                    <SuccessContent />
                </Suspense>
            </div>
        </main>
    );
}
