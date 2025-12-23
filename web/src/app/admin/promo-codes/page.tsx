import { getAllPromoCodes } from "@/actions/promo-codes";
import AdminPromoCodesClient from "@/components/admin/AdminPromoCodesClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
    const session = await auth();

    // Development bypass - skip role check if SKIP_AUTH is true
    const skipAuth = process.env.SKIP_AUTH === "true";

    // @ts-ignore
    if (!skipAuth && session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const promoCodes = await getAllPromoCodes();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div>
                <h1
                    style={{
                        fontSize: "3.5rem",
                        fontFamily: "var(--font-heading)",
                        color: "white",
                        lineHeight: "1",
                        marginBottom: "12px",
                    }}
                >
                    PROMO CODE MANAGEMENT
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
                    Create and manage discount promotions with advanced targeting and usage tracking.
                </p>
            </div>

            <AdminPromoCodesClient initialPromoCodes={promoCodes} />
        </div>
    );
}
