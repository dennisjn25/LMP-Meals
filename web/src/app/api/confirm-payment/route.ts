import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { syncData } from '@/lib/quickbooks-sync';

export async function POST(req: Request) {
    try {
        const { orderId, paymentId, paymentStatus } = await req.json();

        if (!orderId || !paymentId) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Get order with items
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Order not found'
            }, { status: 404 });
        }

        // Update order status to PAID
        await db.order.update({
            where: { id: orderId },
            data: {
                status: 'PAID',
                squarePaymentId: paymentId
            }
        });

        // Build order details HTML for email
        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = order.total - subtotal;

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
                        <td style="text-align: right; padding: 12px 0; font-weight: 800; font-size: 1.1em;">$${order.total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p><strong>Delivery Address:</strong><br>
                ${order.shippingAddress}<br>
                ${order.city}, AZ ${order.zipCode}</p>
                ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
                ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
        `;

        // Send confirmation email
        try {
            await sendOrderConfirmationEmail({
                customerEmail: order.customerEmail,
                customerName: order.customerName,
                orderNumber: order.orderNumber,
                orderDetails: orderDetailsHtml,
                total: `$${order.total.toFixed(2)}`,
                transactionsId: paymentId,
                paymentMethod: 'Card'
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the order if email fails
        }

        // Sync with QuickBooks
        try {
            await syncData();
        } catch (qbError) {
            console.error('QuickBooks sync failed:', qbError);
            // Don't fail the order if QB sync fails
        }

        return NextResponse.json({
            success: true,
            orderNumber: order.orderNumber
        });

    } catch (error: any) {
        console.error('Payment confirmation failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to confirm payment. Please contact support.'
        }, { status: 500 });
    }
}
