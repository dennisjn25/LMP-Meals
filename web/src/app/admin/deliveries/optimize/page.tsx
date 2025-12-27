import { getDeliveries, getDrivers } from "@/actions/delivery";
import OptimizationClient from "./OptimizationClient";
import { tokens } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function RouteOptimizationPage() {
    const deliveriesRes = await getDeliveries();
    const driversRes = await getDrivers();

    const deliveries = ((deliveriesRes as any).success || []).filter((d: any) => d.status === "PENDING" && !d.routeId);
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
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1
                }}>
                    Route <span style={{ color: tokens.colors.accent.DEFAULT }}>Optimization</span>
                </h1>
                <p style={{
                    color: tokens.colors.text.inverseSecondary,
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

