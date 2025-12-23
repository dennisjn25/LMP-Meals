import { db } from "@/lib/db";
import RouteDetailClient from "./RouteDetailClient";
import { notFound } from "next/navigation";

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const route = await db.route.findUnique({
        where: { id },
        include: {
            deliveries: {
                include: {
                    order: true
                },
                orderBy: { sequence: 'asc' }
            }
        }
    });

    if (!route) return notFound();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0B0E14',
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <RouteDetailClient route={route} />
        </div>
    );
}
