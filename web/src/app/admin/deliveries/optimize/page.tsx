import { getDeliveries, getDrivers } from "@/actions/delivery";
import OptimizationClient from "./OptimizationClient";

export const dynamic = "force-dynamic";

export default async function RouteOptimizationPage() {
    const deliveriesRes = await getDeliveries();
    const driversRes = await getDrivers();

    const deliveries = (deliveriesRes.success || []).filter((d: any) => d.status === "PENDING" && !d.routeId);
    const drivers = driversRes.success || [];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    marginBottom: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#ffffff'
                }}>
                    Route <span style={{ color: '#fbbf24' }}>Optimization</span>
                </h1>
                <p style={{
                    color: '#e5e7eb',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    maxWidth: '800px',
                    lineHeight: '1.6'
                }}>
                    Generate efficient routes for your drivers using machine learning and traffic data.
                </p>
            </div>

            <OptimizationClient
                pendingDeliveries={deliveries}
                drivers={drivers}
            />
        </div>
    );
}
