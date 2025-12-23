"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function createAuditLog(action: string, entityId: string | null, details: any) {
    const session = await auth();
    await db.auditLog.create({
        data: {
            action,
            entityType: "EMPLOYEE",
            entityId,
            userId: session?.user?.id,
            userName: session?.user?.name,
            details: JSON.stringify(details)
        }
    });
}

// ...

export async function createEmployee(data: {
    name: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    status: string;
    salary?: number;
    hireDate?: Date;
    startDate?: Date;
    notes?: string;
    userId?: string;
    password?: string;
    role?: string;
}) {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }


    try {
        let userId = data.userId;
        const { password, role, isAdmin, ...employeeData } = data as any;

        // Handle User Account Creation/Update if password is provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if user exists
            const existingUser = await db.user.findUnique({
                where: { email: data.email }
            });

            if (existingUser) {
                // Update existing user
                await db.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password: hashedPassword,
                        role: role || "ADMIN", // Default to ADMIN for portal access if not specified
                        name: data.name
                    }
                });
                userId = existingUser.id;
            } else {
                // Create new user
                const newUser = await db.user.create({
                    data: {
                        email: data.email,
                        name: data.name,
                        password: hashedPassword,
                        role: role || "ADMIN",
                        emailVerified: new Date()
                    }
                });
                userId = newUser.id;
            }
        }

        const employee = await db.employee.create({
            data: {
                ...employeeData,
                userId: userId,
                startDate: data.startDate || new Date()
            }
        });

        await createAuditLog("CREATE_EMPLOYEE", employee.id, { ...data, password: password ? '********' : undefined });
        revalidatePath("/admin/employees");
        return { success: true, employee };
    } catch (error: any) {
        return { error: error.message || "Failed to create employee" };
    }
}

export async function updateEmployee(id: string, data: any) {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const { password, role, isAdmin, ...employeeData } = data;
        const oldEmployee = await db.employee.findUnique({ where: { id } });

        if (!oldEmployee) return { error: "Employee not found" };

        let userId = oldEmployee.userId;

        // Handle Password/User Update
        if (password || role) {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

            if (userId) {
                // Update existing linked user
                await db.user.update({
                    where: { id: userId },
                    data: {
                        ...(hashedPassword && { password: hashedPassword }),
                        ...(role && { role }),
                        name: employeeData.name || oldEmployee.name,
                        email: employeeData.email || oldEmployee.email
                    }
                });
            } else if (password) {
                // No linked user, but password provided -> Create/Link user
                // Check if user exists by email first
                const existingUser = await db.user.findUnique({
                    where: { email: employeeData.email || oldEmployee.email }
                });

                if (existingUser) {
                    await db.user.update({
                        where: { id: existingUser.id },
                        data: {
                            password: hashedPassword,
                            role: role || "ADMIN",
                            name: employeeData.name || oldEmployee.name
                        }
                    });
                    userId = existingUser.id;
                } else {
                    const newUser = await db.user.create({
                        data: {
                            email: employeeData.email || oldEmployee.email,
                            name: employeeData.name || oldEmployee.name,
                            password: hashedPassword,
                            role: role || "ADMIN",
                            emailVerified: new Date()
                        }
                    });
                    userId = newUser.id;
                }
            }
        }

        const employee = await db.employee.update({
            where: { id },
            data: {
                ...employeeData,
                ...(userId && { userId })
            }
        });

        await createAuditLog("UPDATE_EMPLOYEE", id, {
            old: oldEmployee,
            new: { ...data, password: password ? '********' : undefined }
        });

        revalidatePath("/admin/employees");
        return { success: true, employee };
    } catch (error: any) {
        return { error: error.message || "Failed to update employee" };
    }
}

export async function deleteEmployee(id: string) {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const oldEmployee = await db.employee.findUnique({ where: { id } });
        await db.employee.delete({ where: { id } });

        await createAuditLog("DELETE_EMPLOYEE", id, oldEmployee);
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to delete employee" };
    }
}

export async function getAuditLogs(entityId?: string) {
    return await db.auditLog.findMany({
        where: entityId ? { entityId } : {},
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}
