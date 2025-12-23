import { getDeliveries, getRoutes, getDrivers } from "@/actions/delivery";
import DeliveriesClient from "./DeliveriesClient";

export default async function DeliveriesPage() {
    const deliveriesRes = await getDeliveries();
    const routesRes = await getRoutes();
    const driversRes = await getDrivers();

    const deliveries = deliveriesRes.success || [];
    const routes = routesRes.success || [];
    const drivers = driversRes.success || [];

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
                    Delivery <span style={{ color: '#fbbf24' }}>Management</span>
                </h1>
                <p style={{
                    color: '#e5e7eb',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    maxWidth: '800px',
                    lineHeight: '1.6'
                }}>
                    Track, optimize, and manage your meal prep deliveries with military precision.
                </p>
            </div>

            <DeliveriesClient
                initialDeliveries={deliveries}
                initialRoutes={routes}
                drivers={drivers}
            />
        </div>
    );
}
