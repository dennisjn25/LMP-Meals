"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { auth } from "@/auth";
import { syncData } from "@/lib/quickbooks-sync";
import { square } from "@/lib/square";
import { randomUUID } from "crypto";


// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LMP-${timestamp}-${random}`;
}

import { isDeliveryAddressValid } from "@/lib/delivery-zips";

// ... existing imports

export async function createCheckoutSession(data: {
    // ... params
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    deliveryDate?: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        title: string;
        image?: string;
    }[];
    captchaToken?: string;
    total: number;
}) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const orderNumber = generateOrderNumber();

        // 0. Verify ReCAPTCHA
        if (data.captchaToken) {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (secretKey) {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.captchaToken}`;
                const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
                const recaptchaData = await recaptchaRes.json();

                if (!recaptchaData.success) {
                    console.error("ReCAPTCHA verification failed:", recaptchaData);
                    return { success: false, error: "Security check failed. Please refresh and try again." };
                }
            }
        }

        // 1. Validate Delivery Radius
        if (!isDeliveryAddressValid(data.zipCode)) {
            return {
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ. Please check your text zip code or contact us."
            };
        }

        // 2. Validate Minimum Order Quantity
        const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity < 10) {
            return {
                success: false,
                error: "Minimum order requirement not met. You must order at least 10 meals."
            };
        }

        // 1. Create PENDING order in database
        const order = await db.order.create({
            data: {
                orderNumber,
                userId: userId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                shippingAddress: data.shippingAddress,
                city: data.city,
                zipCode: data.zipCode,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
                total: data.total,
                status: "PENDING",
                items: {
                    create: data.items.map(item => ({
                        mealId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // 2. Create Square Payment Link (Checkout)
        // 2. Create Square Payment Link (Checkout)
        // Note: SDK v40+ changes API access patterns.
        // We use 'checkout' or 'paymentLinks' depending on the exact SDK version structure.
        // Assuming square.checkout.paymentLinks.create based on modern Square SDKs.

        // 2. Create Square Payment Link
        // SDK v43+ - returns the response object directly (no .result wrapper)
        const lineItems = data.items.map(item => ({
            name: item.title,
            quantity: item.quantity.toString(),
            basePriceMoney: {
                amount: BigInt(Math.round(item.price * 100)),
                currency: 'USD' as any
            }
        }));

        const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxAmount = data.total - subtotal;

        if (taxAmount > 0.01) {
            lineItems.push({
                name: "Sales Tax (8.05%)",
                quantity: "1",
                basePriceMoney: {
                    amount: BigInt(Math.round(taxAmount * 100)),
                    currency: 'USD' as any
                }
            });
        }

        const response = await square.checkout.paymentLinks.create({
            idempotencyKey: randomUUID(),
            order: {
                locationId: process.env.SQUARE_LOCATION_ID!,
                referenceId: order.id,
                lineItems: lineItems
            },
            checkoutOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`,
                merchantSupportEmail: process.env.GMAIL_USER,
                askForShippingAddress: false
            }
        });

        const paymentLink = response.paymentLink;

        if (!paymentLink) {
            throw new Error("Failed to create payment link");
        }

        // 3. Update order with square IDs
        await db.order.update({
            where: { id: order.id },
            data: {
                squareOrderId: paymentLink.orderId,
                squareCheckoutId: paymentLink.id
            }
        });

        return { success: true, url: paymentLink.url };
    } catch (error: any) {
        console.error("Square session creation failed:", error);
        // SDK errors might be in error.errors
        if (error.errors) {
            console.error("Square API Errors:", error.errors);
        }
        return { success: false, error: "Failed to initialize payment. Please try again." };
    }
}

export async function getOrderDetails(orderId: string) {
    if (!orderId) return null;

    // Allow public access to this for the success page, but maybe verify it matches session user if possible.
    // For now, we just fetch by ID. Risk: someone guessing IDs to see receipts.
    // Mitigations: order IDs are CUIDs (hard to guess).

    try {
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

        return order;
    } catch (error) {
        console.error("Failed to fetch order details:", error);
        return null;
    }
}

export async function createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    deliveryDate?: string;
    items: {
        id: string; // Meal ID
        quantity: number;
        price: number;
        title?: string; // For email
    }[];
    total: number;
}) {
    // Keeping this for potential "cash on delivery" or manual orders if needed, 
    // but updating to reflect real payment status if called directly
    try {
        // Check for logged in user
        const session = await auth();
        const userId = session?.user?.id;

        // Validate Delivery Radius
        if (!isDeliveryAddressValid(data.zipCode)) {
            return {
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ."
            };
        }

        // Validate Minimum Order Quantity
        const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity < 10) {
            return {
                success: false,
                error: "Minimum order requirement not met. You must order at least 10 meals."
            };
        }

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Fetch meal details for items that don't have titles
        const itemsWithDetails = await Promise.all(
            data.items.map(async (item) => {
                if (!item.title) {
                    const meal = await db.meal.findUnique({
                        where: { id: item.id },
                        select: { title: true }
                    });
                    return { ...item, title: meal?.title || "Unknown Meal" };
                }
                return item;
            })
        );

        // Create Order
        const order = await db.order.create({
            data: {
                orderNumber,
                userId: userId, // Link if logged in
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                shippingAddress: data.shippingAddress,
                city: data.city,
                zipCode: data.zipCode,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
                total: data.total,
                status: "PAID", // Simulating immediate payment success
                items: {
                    create: data.items.map(item => ({
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
                    ${itemsWithDetails.map(item => `
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 12px 0;">${item.title}</td>
                            <td style="text-align: center; padding: 12px 0;">${item.quantity}</td>
                            <td style="text-align: right; padding: 12px 0;">$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p><strong>Delivery Address:</strong><br>
                ${data.shippingAddress}<br>
                ${data.city}, AZ ${data.zipCode}</p>
                ${data.customerPhone ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
                ${data.deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(data.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
        `;

        // Send confirmation email to customer
        try {
            await sendOrderConfirmationEmail({
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                orderNumber,
                orderDetails: orderDetailsHtml,
                total: `$${data.total.toFixed(2)}`
            });
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError);
            // Don't fail the order if email fails
        }

        if (userId) revalidatePath("/dashboard");

        // Real-time QuickBooks Sync
        try {
            await syncData();
        } catch (qbError) {
            console.error("QuickBooks sync failed during order creation:", qbError);
        }

        return { success: true, order, orderNumber };

    } catch (error) {
        console.error("Order creation failed:", error);
        return { success: false, error: "Failed to create order. Please try again." };
    }
}

export async function getOrdersAdmin() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await db.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    meal: true
                }
            }
        }
    });
}

export async function updateOrderStatus(id: string, status: string) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.order.update({
        where: { id },
        data: { status }
    });

    // Real-time QuickBooks Sync
    try {
        await syncData();
    } catch (qbError) {
        console.error("QuickBooks sync failed during status update:", qbError);
    }

    revalidatePath("/admin/orders");
}

export async function createAdminOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    deliveryDate?: string;
    status: string;
    total: number;
    items: {
        id: string; // Meal ID
        quantity: number;
        price: number;
    }[];
}) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const orderNumber = generateOrderNumber();
        const { items, ...orderData } = data;

        const order = await db.order.create({
            data: {
                ...orderData,
                orderNumber,
                deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
                items: {
                    create: items.map((item) => ({
                        mealId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });
        revalidatePath("/admin/orders");
        return { success: true, order };
    } catch (e: any) {
        return { error: e.message || "Failed to create order" };
    }
}

export async function updateAdminOrder(id: string, data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    deliveryDate?: string;
    status: string;
    total: number;
    items?: {
        id: string; // Meal ID
        quantity: number;
        price: number;
    }[];
}) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const { items, ...orderData } = data;

        // Transaction to ensure integrity
        await db.$transaction(async (tx) => {
            // Update order details
            await tx.order.update({
                where: { id },
                data: {
                    ...orderData,
                    deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null
                }
            });

            if (items) {
                // Replace items
                await tx.orderItem.deleteMany({ where: { orderId: id } });
                await tx.orderItem.createMany({
                    data: items.map((item) => ({
                        orderId: id,
                        mealId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }
        });

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Failed to update order" };
    }
}

