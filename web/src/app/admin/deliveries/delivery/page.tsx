import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getDeliveries, getDrivers } from "@/actions/delivery";
import DeliveryDashboard from "@/components/admin/DeliveryDashboard";
import { Truck } from "lucide-react";

export default async function AdminDeliveryPage() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EMPLOYEE") {
        return <div style={{ color: 'white' }}>Unauthorized</div>;
    }

    const { success: deliveries } = await getDeliveries();
    const { success: drivers } = await getDrivers();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: '1',
                    marginBottom: '12px'
                }}>DELIVERY</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Manage delivery routes, assign drivers, and track delivery status.
                </p>
            </div>

            <DeliveryDashboard
                initialDeliveries={deliveries as any[] || []}
                drivers={drivers as any[] || []}
            />
        </div>
    );
}
