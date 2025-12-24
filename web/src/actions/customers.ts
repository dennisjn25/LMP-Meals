"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const CustomerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    phone: z.string().optional(),
    deliveryAddress: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryState: z.string().optional(),
    deliveryZip: z.string().optional(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingZip: z.string().optional(),
});

const checkAdmin = async () => {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';
    if (skipAuth) return true;
    // @ts-ignore
    return session?.user?.role === "ADMIN";
};

export async function createCustomer(values: z.infer<typeof CustomerSchema>) {
    if (!await checkAdmin()) {
        return { error: "Unauthorized" };
    }

    const validatedFields = CustomerSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, ...rest } = validatedFields.data;

    const existingUser = await db.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    try {
        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                ...rest,
                role: "USER"
            }
        });

        revalidatePath("/admin/customers");
        return { success: "Customer created successfully" };
    } catch (error) {
        return { error: "Something went wrong" };
    }
}

export async function updateCustomer(id: string, values: z.infer<typeof CustomerSchema>) {
    if (!await checkAdmin()) {
        return { error: "Unauthorized" };
    }

    const validatedFields = CustomerSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, ...rest } = validatedFields.data;

    try {
        const updateData: any = {
            email,
            ...rest
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await db.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath("/admin/customers");
        return { success: "Customer updated successfully" };
    } catch (error) {
        return { error: "Something went wrong" };
    }
}

export async function deleteCustomer(id: string) {
    if (!await checkAdmin()) {
        return { error: "Unauthorized" };
    }

    try {
        await db.user.delete({
            where: { id }
        });

        revalidatePath("/admin/customers");
        return { success: "Customer deleted successfully" };
    } catch (error) {
        return { error: "Failed to delete customer" };
    }
}
