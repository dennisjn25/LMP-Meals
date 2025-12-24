"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Loader2, CheckCircle2, Calendar, Phone, MapPin, CreditCard } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { isDeliveryAddressValid } from "@/lib/delivery-zips";
import ReCAPTCHA from "react-google-recaptcha";
import SquarePaymentForm from "@/components/SquarePaymentForm";
import { db } from "@/lib/db";

function CheckoutContent() {
    const { items, cartTotal, clearCart } = useCart();
    const TAX_RATE = 0.0805;
    const taxAmount = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + taxAmount;

    const searchParams = useSearchParams();
    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [orderData, setOrderData] = useState<any>(null);
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
    const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber?: string; error?: string } | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Calculate next Sunday delivery date
    const getNextSunday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + daysUntilSunday);
        return nextSunday.toISOString().split('T')[0];
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken) {
            setOrderResult({ success: false, error: "Please complete the security check (reCAPTCHA)." });
            return;
        }

        const formData = new FormData(e.currentTarget);
        const zipCode = formData.get('zipCode') as string;

        // Client-side delivery radius check
        if (!isDeliveryAddressValid(zipCode)) {
            setOrderResult({
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ. Please check your zip code."
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Create pending order
        try {
            const response = await fetch('/api/create-pending-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
                    customerEmail: formData.get('email') as string,
                    customerPhone: formData.get('phone') as string,
                    shippingAddress: formData.get('address') as string,
                    city: formData.get('city') as string,
                    zipCode: formData.get('zipCode') as string,
                    deliveryDate: formData.get('deliveryDate') as string,
                    total: finalTotal,
                    captchaToken: captchaToken || undefined,
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        title: item.title,
                        image: item.image
                    }))
                })
            });

            const result = await response.json();

            if (result.success && result.orderId) {
                setPendingOrderId(result.orderId);
                setOrderData({
                    customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
                    customerEmail: formData.get('email') as string,
                });
                setStep('payment');
            } else {
                setOrderResult({ success: false, error: result.error || "Failed to create order" });
            }
        } catch (error) {
            console.error("Order creation failed", error);
            setOrderResult({ success: false, error: "An unexpected error occurred. Please try again." });
        }
    };

    const handlePaymentSuccess = async (paymentResult: any) => {
        // Update order status to PAID
        try {
            const response = await fetch('/api/confirm-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: pendingOrderId,
                    paymentId: paymentResult.paymentId,
                    paymentStatus: paymentResult.status
                })
            });

            const result = await response.json();

            if (result.success) {
                setOrderResult({
                    success: true,
                    orderNumber: result.orderNumber
                });
                setStep('success');
                clearCart();
            } else {
                setOrderResult({ success: false, error: result.error || "Payment confirmation failed" });
            }
        } catch (error) {
            console.error("Payment confirmation failed", error);
            setOrderResult({ success: false, error: "Payment processed but confirmation failed. Please contact support." });
        }
    };

    const handlePaymentError = (error: string) => {
        setOrderResult({ success: false, error });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Success page
    if (step === 'success' && orderResult?.success) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', maxWidth: '700px' }}>
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

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#000' }}>Order Confirmed!</h1>

                        <div style={{
                            background: '#f0fdf4',
                            border: '2px solid #10b981',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: '#065f46', marginBottom: '8px', fontWeight: 600 }}>
                                ORDER NUMBER
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>
                                {orderResult.orderNumber}
                            </div>
                        </div>

                        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            Thank you for your order! We've sent a confirmation email with your receipt and order details.
                            Your meals will be prepared fresh and delivered on Sunday between 8AM - 12PM.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (orderResult?.success === false) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', maxWidth: '600px' }}>
                    <div className="glass-panel" style={{ padding: '60px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚠️</div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Order Failed</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>
                            {orderResult.error}
                        </p>
                        <button
                            onClick={() => {
                                setOrderResult(null);
                                setStep('form');
                            }}
                            className="btn-black"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', maxWidth: '600px' }}>
                    <div className="glass-panel" style={{ padding: '60px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🛒</div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Your Cart is Empty</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>
                            Add some delicious meals to your cart before checking out.
                        </p>
                        <a href="/menu" className="btn-black">Browse Menu</a>
                    </div>
                </div>
            </main>
        );
    }

    // Minimum Order Quantity Check
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItemsCount < 10) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', maxWidth: '600px' }}>
                    <div className="glass-panel" style={{ padding: '60px', border: '2px solid #ef4444' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚠️</div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: '#ef4444' }}>Minimum 10 Meals Required</h1>
                        <p style={{ color: '#64748b', marginBottom: '16px' }}>
                            You currently have <strong>{totalItemsCount}</strong> meals in your cart.
                        </p>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>
                            To ensure the best delivery experience and sustainability, we require a minimum of 10 meals per order.
                        </p>
                        <a href="/menu" className="btn-black" style={{ background: '#ef4444', border: 'none' }}>
                            Add {10 - totalItemsCount} More Meals
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    // Payment step
    if (step === 'payment') {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
                <Navbar />

                <div className="container" style={{ paddingTop: '120px', maxWidth: '800px' }}>
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Complete Payment</h1>
                        <p style={{ color: '#64748b' }}>Enter your card information to complete your order</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontWeight: 600 }}>Order Total:</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${finalTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {orderData?.customerName} • {orderData?.customerEmail}
                            </div>
                        </div>

                        <SquarePaymentForm
                            amount={finalTotal}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />

                        <button
                            onClick={() => setStep('form')}
                            style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '12px',
                                background: 'transparent',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                color: '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Order Details
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Form step (default)
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '120px', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Checkout</h1>
                    <p style={{ color: '#64748b' }}>Complete your order for Sunday delivery</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>

                    {/* Order Summary */}
                    <div className="glass-panel" style={{ padding: '32px', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', fontWeight: 800 }}>
                            Order Summary
                        </h2>

                        <div style={{ marginBottom: '24px' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                                        <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                                            {item.calories} kcal • Qty: {item.quantity}
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#10b981' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b' }}>
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b' }}>
                                <span>Sales Tax (8.05%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b' }}>
                                <span>Delivery</span>
                                <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800, marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #000' }}>
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="glass-panel" style={{ padding: '40px' }}>
                        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: '32px' }}>

                            {/* Contact Information */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>1</div>
                                    Contact Information
                                </h3>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>First Name *</label>
                                            <input name="firstName" required className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Last Name *</label>
                                            <input name="lastName" required className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address *</label>
                                        <input name="email" required type="email" className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} placeholder="you@example.com" />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            Phone Number
                                        </label>
                                        <input name="phone" type="tel" className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} placeholder="602-891-4619" />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>2</div>
                                    Delivery Details
                                </h3>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            Street Address *
                                        </label>
                                        <input name="address" required className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} placeholder="123 Main Street" />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>City *</label>
                                            <input name="city" required defaultValue="Scottsdale" className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Zip Code *</label>
                                            <input name="zipCode" required className="input-field" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} placeholder="85251" />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            Delivery Date
                                        </label>
                                        <input
                                            name="deliveryDate"
                                            type="date"
                                            defaultValue={getNextSunday()}
                                            className="input-field"
                                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                        />
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                            📦 Deliveries are made on Sundays between 8AM - 12PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                        onChange={(token) => setCaptchaToken(token)}
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn-black"
                                style={{
                                    padding: '18px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                CONTINUE TO PAYMENT →
                            </button>

                            <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                                By placing this order, you agree to our terms of service and privacy policy.
                                Submit your order by 9PM Wednesday, to receive your order by Sunday.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <Loader2 className="animate-spin" size={48} color="#000" />
                </div>
            </main>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
