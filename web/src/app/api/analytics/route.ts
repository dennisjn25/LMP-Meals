import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    // Date range calculation
    const now = new Date();
    const startDate = new Date();
    if (period === "24h") startDate.setHours(now.getHours() - 24);
    else if (period === "7d") startDate.setDate(now.getDate() - 7);
    else if (period === "30d") startDate.setDate(now.getDate() - 30);

    const prevStartDate = new Date(startDate);
    if (period === "24h") prevStartDate.setHours(startDate.getHours() - 24);
    else if (period === "7d") prevStartDate.setDate(startDate.getDate() - 7);
    else if (period === "30d") prevStartDate.setDate(startDate.getDate() - 30);

    try {
        // Fetch current period data
        const [
            pageViewsCount,
            uniqueVisitorsCount,
            sessions,
            totalReferers
        ] = await Promise.all([
            db.pageView.count({ where: { createdAt: { gte: startDate } } }),
            db.pageView.groupBy({
                by: ['sessionId'],
                where: { createdAt: { gte: startDate } }
            }).then(res => res.length),
            db.analyticsSession.findMany({
                where: { startedAt: { gte: startDate } }
            }),
            db.pageView.groupBy({
                by: ['referer'],
                where: { createdAt: { gte: startDate } },
                _count: { referer: true }
            })
        ]);

        // Previoud period for comparison
        const [prevPageViews, prevUnique] = await Promise.all([
            db.pageView.count({ where: { createdAt: { gte: prevStartDate, lt: startDate } } }),
            db.pageView.groupBy({
                by: ['sessionId'],
                where: { createdAt: { gte: prevStartDate, lt: startDate } }
            }).then(res => res.length)
        ]);

        // Calculate bounce rate (sessions with only 1 page view)
        // This is simplified
        const sessionHits = await db.pageView.groupBy({
            by: ['sessionId'],
            where: { createdAt: { gte: startDate } },
            _count: { id: true }
        });
        const bounces = sessionHits.filter(s => s._count.id === 1).length;
        const bounceRate = sessionHits.length > 0 ? (bounces / sessionHits.length) * 100 : 0;

        // Trends (chunked by time)
        // Trends (chunked by time)
        const trendPoints = period === "24h" ? 24 : period === "7d" ? 7 : 30;

        // Business Analytics: Revenue & Orders
        const [
            revenue,
            ordersCount,
            prevRevenue,
            prevOrdersCount,
            topMealsRaw
        ] = await Promise.all([
            // Current Period Revenue (PAID, COMPLETED, DELIVERED)
            db.order.aggregate({
                _sum: { total: true },
                where: {
                    createdAt: { gte: startDate },
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }),
            // Current Period Order Count
            db.order.count({
                where: {
                    createdAt: { gte: startDate },
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }),
            // Previous Period Revenue
            db.order.aggregate({
                _sum: { total: true },
                where: {
                    createdAt: { gte: prevStartDate, lt: startDate },
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }),
            // Previous Period Order Count
            db.order.count({
                where: {
                    createdAt: { gte: prevStartDate, lt: startDate },
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }),
            // Top Meals
            db.orderItem.groupBy({
                by: ['mealId'],
                where: { order: { createdAt: { gte: startDate }, status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] } } },
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })
        ]);

        // Resolve Meal Names
        const topMeals = await Promise.all(topMealsRaw.map(async (item) => {
            const meal = await db.meal.findUnique({ where: { id: item.mealId }, select: { title: true } });
            return {
                name: meal?.title || 'Unknown Meal',
                count: item._sum.quantity || 0
            };
        }));

        const currentRevenue = revenue._sum.total || 0;
        const previousRevenue = prevRevenue._sum.total || 0;

        const data = {
            metrics: {
                revenue: {
                    current: currentRevenue,
                    previous: previousRevenue,
                    trend: Array.from({ length: trendPoints }, () => Math.floor(currentRevenue / trendPoints * (0.8 + Math.random() * 0.4))), // Mock daily distr based on total
                    unit: "$"
                },
                orders: {
                    current: ordersCount,
                    previous: prevOrdersCount,
                    trend: Array.from({ length: trendPoints }, () => Math.floor(ordersCount / trendPoints * (0.8 + Math.random() * 0.4))),
                    unit: ""
                },
                pageViews: {
                    current: pageViewsCount || 0,
                    previous: prevPageViews || 0,
                    trend: Array.from({ length: trendPoints }, (_, i) => Math.floor(Math.random() * 50)), // Real trend requires grouping by date
                    unit: ""
                },
                uniqueVisitors: {
                    current: uniqueVisitorsCount || 0,
                    previous: prevUnique || 0,
                    trend: Array.from({ length: trendPoints }, (_, i) => Math.floor(Math.random() * 20)),
                    unit: ""
                },
                bounceRate: {
                    current: Number(bounceRate.toFixed(1)),
                    previous: 45.2, // Mock previous for now
                    trend: Array.from({ length: trendPoints }, (_, i) => 40 + Math.random() * 10),
                    unit: "%"
                },
                sessionDuration: {
                    current: 120, // Mock for now, requires complex time calculation
                    previous: 110,
                    trend: Array.from({ length: trendPoints }, (_, i) => 100 + Math.random() * 50),
                    unit: "s"
                }
            },
            topMeals,
            trafficSources: totalReferers
                .filter(r => r.referer)
                .map(r => ({
                    source: r.referer!.includes('google') ? 'Google' :
                        r.referer!.includes('facebook') || r.referer!.includes('instagram') ? 'Social' :
                            r.referer!.includes('lmpmeals.com') ? 'Direct' : r.referer,
                    value: Math.floor((r._count.referer / pageViewsCount) * 100),
                    color: "#fbbf24"
                })).slice(0, 4),
            geoDistribution: [
                { region: "Arizona, US", visitors: Math.floor(uniqueVisitorsCount * 0.8) },
                { region: "Other", visitors: Math.floor(uniqueVisitorsCount * 0.2) }
            ]
        };

        // Fallback for traffic sources if none found
        if (data.trafficSources.length === 0) {
            data.trafficSources = [
                { source: "Direct", value: 100, color: "#fbbf24" }
            ];
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
