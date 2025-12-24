"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SquarePaymentFormProps {
    amount: number;
    onPaymentSuccess: (paymentResult: any) => void;
    onPaymentError: (error: string) => void;
}

export default function SquarePaymentForm({ amount, onPaymentSuccess, onPaymentError }: SquarePaymentFormProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const cardRef = useRef<any>(null);
    const paymentsRef = useRef<any>(null);

    useEffect(() => {
        const loadSquareSDK = async () => {
            try {
                // Load Square Web Payments SDK
                if (!(window as any).Square) {
                    const script = document.createElement('script');
                    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
                    script.async = true;
                    script.onload = () => initializeSquare();
                    document.body.appendChild(script);
                } else {
                    initializeSquare();
                }
            } catch (error) {
                console.error('Failed to load Square SDK:', error);
                onPaymentError('Failed to load payment form. Please refresh the page.');
            }
        };

        const initializeSquare = async () => {
            try {
                const Square = (window as any).Square;
                if (!Square) {
                    throw new Error('Square.js failed to load properly');
                }

                const payments = Square.payments(
                    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
                    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
                );

                paymentsRef.current = payments;

                const card = await payments.card();
                await card.attach('#card-container');
                cardRef.current = card;

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to initialize Square:', error);
                onPaymentError('Failed to initialize payment form. Please refresh the page.');
            }
        };

        loadSquareSDK();

        return () => {
            if (cardRef.current) {
                cardRef.current.destroy();
            }
        };
    }, [onPaymentError]);

    const handlePayment = async () => {
        if (!cardRef.current) {
            onPaymentError('Payment form not initialized');
            return;
        }

        setIsProcessing(true);

        try {
            const result = await cardRef.current.tokenize();

            if (result.status === 'OK') {
                // Send token to your server
                const response = await fetch('/api/process-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sourceId: result.token,
                        amount: Math.round(amount * 100), // Convert to cents
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    onPaymentSuccess(data);
                } else {
                    onPaymentError(data.error || 'Payment failed');
                }
            } else {
                let errorMessage = 'Payment failed. Please check your card details.';
                if (result.errors) {
                    errorMessage = result.errors.map((e: any) => e.message).join(', ');
                }
                onPaymentError(errorMessage);
            }
        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError('An unexpected error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <div
                id="card-container"
                style={{
                    minHeight: '200px',
                    padding: '20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: '#fff'
                }}
            >
                {isLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                        <Loader2 className="animate-spin" size={32} color="#10b981" />
                        <p style={{ marginTop: '12px', color: '#64748b' }}>Loading payment form...</p>
                    </div>
                )}
            </div>

            <button
                onClick={handlePayment}
                disabled={isLoading || isProcessing}
                className="btn-black"
                style={{
                    width: '100%',
                    marginTop: '20px',
                    padding: '18px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: (isLoading || isProcessing) ? 0.7 : 1,
                    cursor: (isLoading || isProcessing) ? 'not-allowed' : 'pointer'
                }}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        PROCESSING PAYMENT...
                    </>
                ) : (
                    <>
                        PAY ${amount.toFixed(2)}
                    </>
                )}
            </button>
        </div>
    );
}
