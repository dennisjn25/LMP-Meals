"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Helper to check for admin/dispatcher roles
const checkAuth = async () => {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (skipAuth) return true;
    // @ts-ignore
    return session?.user?.role === "ADMIN" || session?.user?.role === "DISPATCHER";
};

export const getDeliveries = async () => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const deliveries = await db.delivery.findMany({
            include: {
                order: true,
                driver: true,
                route: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: deliveries };
    } catch (error) {
        console.error("Failed to fetch deliveries:", error);
        return { error: "Failed to fetch deliveries" };
    }
};

export const createDeliveryFromOrder = async (orderId: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const delivery = await db.delivery.create({
            data: {
                orderId,
                status: "PENDING"
            }
        });
        revalidatePath("/admin/deliveries");
        return { success: delivery };
    } catch (error) {
        return { error: "Failed to create delivery" };
    }
};

export const updateDeliveryStatus = async (deliveryId: string, status: string, podData?: any) => {
    // This might be called by drivers too
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // Simple POD update if provided
    const data: any = { status };
    if (status === "DELIVERED") {
        data.deliveredAt = new Date();
        if (podData) {
            data.signedBy = podData.signedBy;
            data.signatureImage = podData.signatureImage;
            data.deliveryPhoto = podData.deliveryPhoto;
            data.latitude = podData.latitude;
            data.longitude = podData.longitude;
        }
    }

    try {
        const delivery = await db.delivery.update({
            where: { id: deliveryId },
            data
        });

        // Also update order status if delivered
        if (status === "DELIVERED") {
            await db.order.update({
                where: { id: delivery.orderId },
                data: { status: "DELIVERED" }
            });
        }

        revalidatePath("/admin/deliveries");
        revalidatePath("/admin/orders");
        return { success: delivery };
    } catch (error) {
        return { error: "Failed to update status" };
    }
};

export const createRoute = async (driverId?: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const route = await db.route.create({
            data: {
                driverId,
                status: "PLANNED",
                date: new Date()
            }
        });
        revalidatePath("/admin/deliveries");
        return { success: route };
    } catch (error) {
        return { error: "Failed to create route" };
    }
};

export const getRoutes = async () => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const routes = await db.route.findMany({
            include: {
                driver: true,
                deliveries: {
                    include: {
                        order: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: routes };
    } catch (error) {
        return { error: "Failed to fetch routes" };
    }
};

export const assignDeliveryToRoute = async (deliveryId: string, routeId: string, sequence: number) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const delivery = await db.delivery.update({
            where: { id: deliveryId },
            data: { routeId, sequence }
        });
        revalidatePath("/admin/deliveries");
        return { success: delivery };
    } catch (error) {
        return { error: "Failed to assign to route" };
    }
};

export const getDrivers = async () => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        const drivers = await db.user.findMany({
            where: {
                OR: [
                    { role: "DRIVER" },
                    { role: "ADMIN" },
                    { role: "EMPLOYEE" }
                ]
            }
        });
        return { success: drivers };
    } catch (error) {
        return { error: "Failed to fetch drivers" };
    }
};
