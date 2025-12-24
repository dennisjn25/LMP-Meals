import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { isDeliveryAddressValid } from '@/lib/delivery-zips';

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

        // Validate delivery radius
        if (!isDeliveryAddressValid(data.zipCode)) {
            return NextResponse.json({
                success: false,
                error: "We currently only deliver within a 25-mile radius of Scottsdale, AZ."
            }, { status: 400 });
        }

        // Validate minimum order quantity
        const totalQuantity = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        if (totalQuantity < 10) {
            return NextResponse.json({
                success: false,
                error: "Minimum order requirement not met. You must order at least 10 meals."
            }, { status: 400 });
        }

        // Verify ReCAPTCHA if provided
        if (data.captchaToken) {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (secretKey) {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.captchaToken}`;
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

        // Create PENDING order
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
                    create: data.items.map((item: any) => ({
                        mealId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber
        });

    } catch (error: any) {
        console.error('Order creation failed:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to create order. Please try again."
        }, { status: 500 });
    }
}
