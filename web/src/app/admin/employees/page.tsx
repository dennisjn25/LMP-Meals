import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EmployeeManager from "@/components/admin/EmployeeManager";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const employees = await db.employee.findMany({
        orderBy: { name: 'asc' },
        include: {
            user: {
                select: {
                    role: true,
                    image: true
                }
            }
        }
    });

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    marginBottom: '12px',
                    letterSpacing: '0.05em',
                    color: '#ffffff',
                    textTransform: 'uppercase'
                }}>
                    Employee <span style={{ color: '#fbbf24' }}>Directory</span>
                </h1>
                <p style={{
                    color: '#e5e7eb',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    maxWidth: '800px',
                    lineHeight: '1.6'
                }}>
                    Manage your staff, roles, and permissions effectively.
                </p>
            </div>

            <EmployeeManager initialEmployees={employees} />
        </div>
    );
}
