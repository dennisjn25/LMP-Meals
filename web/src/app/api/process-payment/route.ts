import { NextResponse } from 'next/server';
import { square } from '@/lib/square';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        const { sourceId, amount, orderId } = await req.json();

        if (!sourceId || !amount) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create payment with Square
        const response = await square.payments.create({
            idempotencyKey: randomUUID(),
            sourceId: sourceId,
            amountMoney: {
                amount: BigInt(amount),
                currency: 'USD' as any
            },
            locationId: process.env.SQUARE_LOCATION_ID!,
            ...(orderId && { referenceId: orderId })
        });

        const payment = response.payment;

        if (!payment) {
            throw new Error('Payment creation failed');
        }

        return NextResponse.json({
            success: true,
            paymentId: payment.id,
            status: payment.status,
            receiptUrl: payment.receiptUrl
        });

    } catch (error: any) {
        console.error('Payment processing error:', error);

        let errorMessage = 'Payment failed. Please try again.';
        if (error.errors && error.errors.length > 0) {
            errorMessage = error.errors[0].detail || errorMessage;
        }

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
