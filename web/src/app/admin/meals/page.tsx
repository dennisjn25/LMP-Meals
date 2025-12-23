import { getAllMealsAdmin } from "@/actions/meals";
import AdminMealsClient from "@/components/admin/AdminMealsClient";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminMealsPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === 'true';

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }


    const meals = await getAllMealsAdmin();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: '1',
                    marginBottom: '12px'
                }}>PRODUCT CATALOG</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Manage meal specifications, nutritional data, and visual presentation.
                </p>
            </div>

            <AdminMealsClient initialMeals={meals} />
        </div>
    );
}

