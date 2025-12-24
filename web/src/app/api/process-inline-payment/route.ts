import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { square } from '@/lib/square';
import { randomUUID } from 'crypto';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { syncData } from '@/lib/quickbooks-sync';
import { auth } from '@/auth';
import { isDeliveryAddressValid } from '@/lib/delivery-zips';
import { geocodeAddress } from '@/lib/google-maps';

function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LMP-${timestamp}-${random}`;
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        const data = await req.json();
        const { sourceId, amount, customerName, customerEmail, customerPhone, shippingAddress, city, zipCode, deliveryDate, captchaToken, items } = data;

        // Validate delivery radius
        if (!isDeliveryAddressValid(zipCode)) {
            return NextResponse.json({
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ."
            }, { status: 400 });
        }

        // Validate minimum order quantity
        const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        if (totalQuantity < 10) {
            return NextResponse.json({
                success: false,
                error: "Minimum order requirement not met. You must order at least 10 meals."
            }, { status: 400 });
        }

        // Verify ReCAPTCHA if provided
        if (captchaToken) {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (secretKey) {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
                const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
                const recaptchaData = await recaptchaRes.json();

                if (!recaptchaData.success) {
                    return NextResponse.json({
                        success: false,
                        error: "Security check failed. Please refresh and try again."
                    }, { status: 400 });
                }
            }
        }

        const orderNumber = generateOrderNumber();
        const total = amount / 100; // Convert from cents to dollars

        // Create order with PENDING status
        const order = await db.order.create({
            data: {
                orderNumber,
                userId: userId,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                city,
                zipCode,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
                total,
                status: "PENDING",
                items: {
                    create: items.map((item: any) => ({
                        mealId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                }
            }
        });

        // Process payment with Square
        const paymentResponse = await square.payments.create({
            idempotencyKey: randomUUID(),
            sourceId: sourceId,
            amountMoney: {
                amount: BigInt(amount),
                currency: 'USD' as any
            },
            locationId: process.env.SQUARE_LOCATION_ID!,
            referenceId: order.id
        });

        const payment = paymentResponse.payment;

        if (!payment || payment.status !== 'COMPLETED') {
            // Payment failed - delete the order
            await db.order.delete({ where: { id: order.id } });

            return NextResponse.json({
                success: false,
                error: "Payment was declined. Please check your card details and try again."
            }, { status: 400 });
        }

        // Geocode shipping address for real-time map visualization
        const geo = await geocodeAddress(`${shippingAddress}, ${city}, AZ ${zipCode}`);

        // Update order to PAID
        await db.order.update({
            where: { id: order.id },
            data: {
                status: 'PAID',
                squarePaymentId: payment.id
            }
        });

        // Create delivery record with geocoded coordinates
        await db.delivery.create({
            data: {
                orderId: order.id,
                status: "PENDING",
                latitude: geo?.lat,
                longitude: geo?.lng
            }
        });

        // Build order details HTML for email
        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total - subtotal;

        const orderDetailsHtml = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                        <th style="text-align: left; padding: 12px 0;">Item</th>
                        <th style="text-align: center; padding: 12px 0;">Qty</th>
                        <th style="text-align: right; padding: 12px 0;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 12px 0;">${item.meal.title}</td>
                            <td style="text-align: center; padding: 12px 0;">${item.quantity}</td>
                            <td style="text-align: right; padding: 12px 0;">$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr style="border-top: 2px solid #e5e7eb;">
                        <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: 600;">Subtotal:</td>
                        <td style="text-align: right; padding: 12px 0;">$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: 600;">Sales Tax (8.05%):</td>
                        <td style="text-align: right; padding: 12px 0;">$${tax.toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #000;">
                        <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: 800; font-size: 1.1em;">Total:</td>
                        <td style="text-align: right; padding: 12px 0; font-weight: 800; font-size: 1.1em;">$${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p><strong>Delivery Address:</strong><br>
                ${shippingAddress}<br>
                ${city}, AZ ${zipCode}</p>
                ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
                ${deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
        `;

        // Send confirmation email
        try {
            await sendOrderConfirmationEmail({
                customerEmail,
                customerName,
                orderNumber,
                orderDetails: orderDetailsHtml,
                total: `$${total.toFixed(2)}`,
                transactionsId: payment.id,
                paymentMethod: 'Card'
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        // Sync with QuickBooks
        try {
            await syncData();
        } catch (qbError) {
            console.error('QuickBooks sync failed:', qbError);
        }

        return NextResponse.json({
            success: true,
            orderNumber: orderNumber,
            orderId: order.id
        });

    } catch (error: any) {
        console.error('Payment processing error:', error);

        let errorMessage = 'Payment failed. Please try again.';
        if (error.errors && error.errors.length > 0) {
            errorMessage = error.errors[0].detail || errorMessage;
        }

        return NextResponse.json({
            success: false,
            error: errorMessage
        }, { status: 500 });
    }
}
