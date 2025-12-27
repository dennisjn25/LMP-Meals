import { getDeliveries, getRoutes, getDrivers } from "@/actions/delivery";
import DeliveriesClient from "./DeliveriesClient";
import { tokens } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function DeliveriesPage() {
    const deliveriesRes = await getDeliveries();
    const routesRes = await getRoutes();
    const driversRes = await getDrivers();

    const deliveries = (deliveriesRes as any).success || [];
    const routes = (routesRes as any).success || [];
    const drivers = (driversRes as any).success || [];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: tokens.spacing.xxl }}>
            <div style={{ marginBottom: tokens.spacing.xxl }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    marginBottom: tokens.spacing.sm,
                    letterSpacing: '0.05em',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    lineHeight: 1
                }}>
                    Delivery <span style={{ color: tokens.colors.accent.DEFAULT }}>Management</span>
                </h1>
                <p style={{
                    color: tokens.colors.text.inverseSecondary,
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

