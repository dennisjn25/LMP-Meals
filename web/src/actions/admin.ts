"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const deleteUser = async (userId: string) => {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // Check if user is admin
    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        return { error: "Forbidden" };
    }


    try {
        await db.user.delete({
            where: { id: userId }
        });
        revalidatePath("/admin");
        return { success: "User deleted" };
    } catch (error) {
        return { error: "Failed to delete user" };
    }
}

export const updateUserRole = async (userId: string, role: string) => {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        return { error: "Forbidden" };
    }


    try {
        await db.user.update({
            where: { id: userId },
            data: { role }
        });
        revalidatePath("/admin");
        return { success: "Role updated" };
    } catch (error) {
        return { error: "Failed to update role" };
    }
}
