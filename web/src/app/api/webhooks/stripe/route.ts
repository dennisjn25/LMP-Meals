import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { syncData } from "@/lib/quickbooks-sync";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            return new NextResponse("Order ID not found in metadata", { status: 400 });
        }

        // Update order status to PAID
        const order = await db.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                // Sometimes also useful to store payment intent ID
            },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                }
            }
        });

        // Build order details HTML for email
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
                </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p><strong>Delivery Address:</strong><br>
                ${order.shippingAddress}<br>
                ${order.city}, ${order.deliveryState || 'AZ'} ${order.zipCode}</p>
                ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
                ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
        `;

        // Send confirmation email to customer
        try {
            await sendOrderConfirmationEmail({
                customerEmail: order.customerEmail,
                customerName: order.customerName,
                orderNumber: order.orderNumber,
                orderDetails: orderDetailsHtml,
                total: `$${order.total.toFixed(2)}`
            });
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError);
        }

        // Sync with QuickBooks
        try {
            await syncData();
        } catch (qbError) {
            console.error("QuickBooks sync failed after payment:", qbError);
        }
    }

    return new NextResponse(null, { status: 200 });
}
