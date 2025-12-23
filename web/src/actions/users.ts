"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath('/admin/employees');
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("Failed to update user role");
    }
}
