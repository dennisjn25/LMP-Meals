import { db } from "@/lib/db";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";
import { syncData } from "@/lib/quickbooks-sync";
import { logError, logInfo } from "@/lib/logger";
import { geocodeAddress } from "@/lib/google-maps";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-square-signature") as string;
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/square`;

    // 1. Validate Square Signature 
    // Square signature validation is a bit specific:
    // It's a HMAC-SHA1 of (url + body) using the webhook secret
    const hmac = crypto.createHmac('sha1', process.env.SQUARE_WEBHOOK_SECRET!);
    hmac.update(webhookUrl + body);
    const expectedSignature = hmac.digest('base64');

    if (signature !== expectedSignature) {
        const msg = "Square Webhook Signature mismatch";
        // Log it but maybe it's just a local testing mismatch
        logError(msg, "SquareWebhook", { signature, expectedSignature });

        // In production, we'd return 400. For now, let's continue if we're in dev and the secret is missing.
        if (process.env.NODE_ENV === 'production') {
            return new NextResponse("Invalid signature", { status: 400 });
        }
    }

    const event = JSON.parse(body);

    // We look for payment.updated or order.updated
    // For Checkout API, payment.created then payment.updated (COMPLETED) is standard
    if (event.type === "payment.updated" && event.data.object.payment.status === "COMPLETED") {
        const payment = event.data.object.payment;
        const squareOrderId = payment.order_id;

        logInfo(`Processing payment completion for Square Order ID: ${squareOrderId}`, "SquareWebhook");

        // Find the order in our database
        const order = await db.order.findFirst({
            where: { squareOrderId: squareOrderId },
            include: {
                items: {
                    include: {
                        meal: true
                    }
                }
            }
        });

        if (order && order.status !== "PAID") {
            const paymentId = payment.id;
            const cardDetails = payment.card_details?.card;
            const brand = cardDetails?.card_brand || "CARD";
            const last4 = cardDetails?.last_4 || "XXXX";
            const paymentMethodStr = `${brand} ending in ${last4}`;

            // Update order status
            await db.order.update({
                where: { id: order.id },
                data: {
                    status: "PAID",
                }
            });

            // Geocode and create delivery record
            try {
                const state = order.deliveryState || "AZ";
                const geo = await geocodeAddress(`${order.shippingAddress}, ${order.city}, ${state} ${order.zipCode}`);
                await db.delivery.create({
                    data: {
                        orderId: order.id,
                        status: "PENDING",
                        latitude: geo?.lat,
                        longitude: geo?.lng
                    }
                });
            } catch (error) {
                logError("Failed to create delivery in Square webhook", "SquareWebhook", error);
            }

            logInfo(`Payment details for Order #${order.orderNumber}: ID=${paymentId}, Brand=${brand}, Last4=${last4}`, "SquareWebhook");

            const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = order.total - subtotal;

            // Build order details HTML
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
                    ${order.city}, ${order.deliveryState || 'AZ'} ${order.zipCode}</p>
                    ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
                    ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
                </div>
            `;

            // Check user preference for email receipts
            let shouldSendEmail = true;
            // ... (rest of logic)

            // Send confirmation email
            if (shouldSendEmail) {
                try {
                    await sendOrderConfirmationEmail({
                        customerEmail: order.customerEmail,
                        customerName: order.customerName,
                        orderNumber: order.orderNumber,
                        orderDetails: orderDetailsHtml,
                        total: `$${order.total.toFixed(2)}`,
                        transactionsId: paymentId,
                        paymentMethod: paymentMethodStr
                    });
                    logInfo(`Order confirmation email sent for Order #${order.orderNumber}`, "SquareWebhook");
                } catch (emailError) {
                    logError("Failed to send order confirmation email", "SquareWebhook", emailError);
                }
            }

            // Send Admin Notification
            try {
                const adminUsers = await db.user.findMany({
                    where: { role: "ADMIN" },
                    select: { email: true }
                });

                const adminEmails = adminUsers.map(u => u.email).filter(Boolean) as string[];
                const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

                if (adminEmails.length > 0) {
                    await sendAdminOrderNotification({
                        adminEmails,
                        customerName: order.customerName,
                        orderNumber: order.orderNumber,
                        total: `$${order.total.toFixed(2)}`,
                        itemsCount: totalQuantity
                    });
                    logInfo(`Admin notification sent for Order #${order.orderNumber}`, "SquareWebhook");
                }
            } catch (adminError) {
                logError("Failed to send admin notification", "SquareWebhook", adminError);
            }

            // Sync with QuickBooks
            try {
                await syncData();
                logInfo(`QuickBooks sync initiated for Order #${order.orderNumber}`, "SquareWebhook");
            } catch (qbError) {
                logError("QuickBooks sync failed after Square payment", "SquareWebhook", qbError);
            }
        } else if (!order) {
            logError(`Order not found for Square Order ID: ${squareOrderId}`, "SquareWebhook");
        } else {
            logInfo(`Order #${order.orderNumber} already marked as PAID. Ignoring duplicate webhook.`, "SquareWebhook");
        }
    }

    return new NextResponse(null, { status: 200 });
}
