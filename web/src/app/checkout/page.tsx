"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Loader2, CheckCircle2, Calendar, Phone, MapPin, CreditCard } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createCheckoutSession } from "@/actions/orders";
import { isDeliveryAddressValid } from "@/lib/delivery-zips";
import ReCAPTCHA from "react-google-recaptcha";

function CheckoutContent() {
    const { data: session } = useSession();
    const { items, cartTotal, clearCart } = useCart();
    const TAX_RATE = 0.0805;
    const taxAmount = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + taxAmount;

    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber?: string; error?: string } | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const cardRef = useRef<any>(null);
    const [squareLoaded, setSquareLoaded] = useState(false);

    // Initialize Square Web Payments SDK
    useEffect(() => {
        let isInstanceMounted = true;

        const initSquare = async () => {
            try {
                // Wait for Square SDK to load if not already present
                if (!(window as any).Square) {
                    const script = document.createElement('script');
                    script.src = 'https://web.squarecdn.com/v1/square.js';
                    script.async = true;
                    script.onload = () => {
                        if (isInstanceMounted) initSquare();
                    };
                    document.head.appendChild(script);
                    return;
                }

                const Square = (window as any).Square;
                const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-_JT8e8xGxmGNJLmBXMkqJA';
                const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LKZ7A9JGG7V0M';

                // Check if card-container exists in DOM
                const container = document.getElementById('card-container');
                if (!container) {
                    // If not ready, wait a bit and retry
                    setTimeout(initSquare, 100);
                    return;
                }

                // Prevent double initialization
                if (cardRef.current) return;

                const payments = Square.payments(appId, locationId);
                const cardInstance = await payments.card();

                if (isInstanceMounted) {
                    await cardInstance.attach('#card-container');
                    cardRef.current = cardInstance;
                    setSquareLoaded(true);
                }
            } catch (error) {
                console.error('Failed to initialize Square:', error);
                if (isInstanceMounted) {
                    setOrderResult({ success: false, error: 'Failed to load payment form. Please refresh the page.' });
                }
            }
        };

        initSquare();

        return () => {
            isInstanceMounted = false;
            if (cardRef.current) {
                cardRef.current.destroy();
                cardRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (searchParams.get('canceled')) {
            setOrderResult({ success: false, error: "Payment was canceled. You can try again when you're ready." });
        }
    }, [searchParams]);

    // Calculate next Sunday delivery date
    const getNextSunday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + daysUntilSunday);
        return nextSunday.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cardRef.current || !squareLoaded) {
            setOrderResult({ success: false, error: "Payment form is still loading. Please wait a moment and try again." });
            return;
        }

        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken) {
            setOrderResult({ success: false, error: "Please complete the security check (reCAPTCHA)." });
            return;
        }

        setIsSubmitting(true);
        setOrderResult(null);

        const formData = new FormData(e.currentTarget);
        const zipCode = formData.get('zipCode') as string;

        // Client-side delivery radius check
        if (!isDeliveryAddressValid(zipCode)) {
            setOrderResult({
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ. Please check your zip code."
            });
            setIsSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // Step 1: Tokenize the card
            const tokenResult = await cardRef.current.tokenize();

            if (tokenResult.status !== 'OK') {
                let errorMessage = 'Please check your card details and try again.';
                if (tokenResult.errors) {
                    errorMessage = tokenResult.errors.map((e: any) => e.message).join(', ');
                }
                setOrderResult({ success: false, error: errorMessage });
                setIsSubmitting(false);
                return;
            }

            const token = tokenResult.token;

            // Step 2: Create order and process payment
            const response = await fetch('/api/process-inline-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceId: token,
                    amount: Math.round(finalTotal * 100), // Convert to cents
                    customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
                    customerEmail: formData.get('email') as string,
                    customerPhone: formData.get('phone') as string,
                    shippingAddress: formData.get('address') as string,
                    city: formData.get('city') as string,
                    zipCode: formData.get('zipCode') as string,
                    deliveryDate: formData.get('deliveryDate') as string,
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

            if (result.success) {
                setOrderResult({ success: true, orderNumber: result.orderNumber });
                clearCart();
            } else {
                setOrderResult({ success: false, error: result.error || "Payment failed. Please try again." });
                setIsSubmitting(false);
                recaptchaRef.current?.reset();
                setCaptchaToken(null);
            }
        } catch (error) {
            console.error("Payment processing failed", error);
            setOrderResult({ success: false, error: "An unexpected error occurred. Please try again." });
            setIsSubmitting(false);
        }
    };

    // Success page
    if (orderResult?.success) {
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
                            onClick={() => setOrderResult(null)}
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
                                <span style={{ color: '#64748b', fontWeight: 600 }}>$0.70/mile</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800, marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #000' }}>
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="glass-panel" style={{ padding: '40px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>

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
                                            <input
                                                name="firstName"
                                                required
                                                defaultValue={session?.user?.name?.split(' ')[0] || ""}
                                                className="input-field"
                                                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Last Name *</label>
                                            <input
                                                name="lastName"
                                                required
                                                defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ""}
                                                className="input-field"
                                                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address *</label>
                                        <input
                                            name="email"
                                            required
                                            type="email"
                                            defaultValue={session?.user?.email || ""}
                                            className="input-field"
                                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            Phone Number
                                        </label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            // @ts-ignore
                                            defaultValue={session?.user?.phone || ""}
                                            className="input-field"
                                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            placeholder="602-891-4619"
                                        />
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
                                        <input
                                            name="address"
                                            required
                                            // @ts-ignore
                                            defaultValue={session?.user?.deliveryAddress || ""}
                                            className="input-field"
                                            style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>City *</label>
                                            <input
                                                name="city"
                                                required
                                                // @ts-ignore
                                                defaultValue={session?.user?.deliveryCity || "Scottsdale"}
                                                className="input-field"
                                                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>State *</label>
                                            <input
                                                name="state"
                                                required
                                                value="Arizona"
                                                readOnly
                                                className="input-field"
                                                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Zip Code *</label>
                                            <input
                                                name="zipCode"
                                                required
                                                // @ts-ignore
                                                defaultValue={session?.user?.deliveryZip || ""}
                                                className="input-field"
                                                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                                                placeholder="85251"
                                            />
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

                            {/* Payment - INLINE CARD FORM */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>3</div>
                                    <CreditCard size={18} />
                                    Payment Information
                                </h3>

                                {/* Square Card Container */}
                                <div
                                    id="card-container"
                                    style={{
                                        minHeight: '100px',
                                        padding: '20px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff',
                                        marginBottom: '16px'
                                    }}
                                />

                                <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>
                                    🔒 Secure payment powered by Square • We accept Visa, Mastercard, Amex, Discover
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
                                disabled={isSubmitting}
                                type="submit"
                                className="btn-black"
                                style={{
                                    padding: '18px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '12px',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        PROCESSING PAYMENT...
                                    </>
                                ) : (
                                    <>
                                        PLACE ORDER • ${finalTotal.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                                By continuing, you agree to our terms of service and privacy policy.
                                <br />
                                Submit your order by 9PM Wednesday to receive delivery by Sunday.
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
