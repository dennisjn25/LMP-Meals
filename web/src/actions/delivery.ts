"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { geocodeAddress } from "@/lib/google-maps";

// Helper to check for admin/employee role
const checkAuth = async () => {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (skipAuth) return true;
    // @ts-ignore
    return session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYEE";
};

// fetching drivers (temporarily just all users or filter by not-yet-exist role)
// For now, let's assume anyone with role "DRIVER" or "ADMIN" can drive.
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
            },
            select: { id: true, name: true, email: true, image: true, role: true }
        });
        return { success: drivers };
    } catch (error) {
        return { error: "Failed to fetch drivers" };
    }
};

export const getDeliveries = async (dateStr?: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };

    // Default to today if not provided, but we might want all pending?
    // Let's get all deliveries that are not COMPLETED/DELIVERED or apply date filter.

    try {
        // Sync check: Create deliveries for PAID orders that don't have one
        const ordersWithoutDelivery = await db.order.findMany({
            where: {
                status: "PAID",
                delivery: { is: null }
            }
        });

        if (ordersWithoutDelivery.length > 0) {
            await Promise.all(
                ordersWithoutDelivery.map(async (order) => {
                    const state = order.deliveryState || "AZ";
                    const fullAddress = `${order.shippingAddress}, ${order.city}, ${state} ${order.zipCode}`;
                    const coords = await geocodeAddress(fullAddress);

                    return db.delivery.create({
                        data: {
                            orderId: order.id,
                            status: "PENDING",
                            estimatedArrival: order.deliveryDate,
                            latitude: coords?.lat,
                            longitude: coords?.lng
                        }
                    });
                })
            );
        }

        const whereClause: any = {};
        if (dateStr) {
            const date = new Date(dateStr);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            whereClause.estimatedArrival = {
                gte: date,
                lt: nextDay
            };
        }

        const deliveries = await db.delivery.findMany({
            where: whereClause,
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        customerName: true,
                        shippingAddress: true,
                        city: true,
                        zipCode: true,
                        status: true,
                        deliveryDate: true
                    }
                },
                driver: {
                    select: { id: true, name: true }
                },
                route: true
            },
            orderBy: {
                estimatedArrival: 'asc'
            }
        });

        return { success: deliveries };
    } catch (error) {
        console.error("Get deliveries error:", error);
        return { error: "Failed to fetch deliveries" };
    }
};

export const assignDriver = async (deliveryId: string, driverId: string | null) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        await db.delivery.update({
            where: { id: deliveryId },
            data: {
                driverId: driverId,
                status: driverId ? "IN_PROGRESS" : "PENDING"
            }
        });
        revalidatePath("/admin/deliveries");
        return { success: true };
    } catch (error) {
        return { error: "Failed to assign driver" };
    }
};

export const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        await db.delivery.update({
            where: { id: deliveryId },
            data: { status }
        });
        revalidatePath("/admin/deliveries");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
};

export const createRoute = async (driverId: string) => {
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

export const assignDeliveryToRoute = async (deliveryId: string, routeId: string, sequence: number) => {
    if (!await checkAuth()) return { error: "Forbidden" };
    try {
        await db.delivery.update({
            where: { id: deliveryId },
            data: {
                routeId,
                sequence,
                status: "IN_PROGRESS"
            }
        });
        revalidatePath("/admin/deliveries");
        return { success: true };
    } catch (error) {
        return { error: "Failed to assign to route" };
    }
};

