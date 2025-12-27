import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const session = await auth();
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    let users: any[] = [];
    try {
        users = await db.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }

    // Serialize users for client components (Date -> ISO string)
    const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
        emailVerified: user.emailVerified instanceof Date ? user.emailVerified.toISOString() : user.emailVerified,
    }));

    return <AdminDashboardClient users={serializedUsers} />;
}

