
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSystemSetting(key: string) {
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key }
        });

        if (!setting) return null;

        return {
            ...setting,
            value: JSON.parse(setting.value)
        };
    } catch (error) {
        console.error("Error fetching system setting:", error);
        return null;
    }
}

export async function updateSystemSetting(key: string, value: any, isEnabled?: boolean) {
    try {
        // Check if setting exists to upsert
        const existing = await db.systemSetting.findUnique({
            where: { key }
        });

        if (existing) {
            await db.systemSetting.update({
                where: { key },
                data: {
                    value: JSON.stringify(value),
                    isEnabled: isEnabled !== undefined ? isEnabled : existing.isEnabled
                }
            });
        } else {
            await db.systemSetting.create({
                data: {
                    key,
                    value: JSON.stringify(value),
                    isEnabled: isEnabled !== undefined ? isEnabled : true
                }
            });
        }

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating system setting:", error);
        return { success: false, error };
    }
}
