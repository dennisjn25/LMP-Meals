import { NextResponse } from "next/server";

// Mock data generator for analytics
const generateTrend = (points: number, min: number, max: number) => {
    return Array.from({ length: points }, () => Math.floor(Math.random() * (max - min) + min));
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    // Simulate different data based on period
    const multiplier = period === "24h" ? 1 : period === "7d" ? 7 : 30;
    const points = period === "24h" ? 24 : period === "7d" ? 7 : 30;

    const data = {
        metrics: {
            pageViews: {
                current: 12540 * multiplier,
                previous: 11200 * multiplier,
                trend: generateTrend(points, 400, 600),
                unit: ""
            },
            uniqueVisitors: {
                current: 4200 * multiplier,
                previous: 3800 * multiplier,
                trend: generateTrend(points, 100, 200),
                unit: ""
            },
            bounceRate: {
                current: 42.5,
                previous: 45.2,
                trend: generateTrend(points, 40, 50).map(v => v + Math.random()),
                unit: "%"
            },
            sessionDuration: {
                current: 184, // seconds
                previous: 162,
                trend: generateTrend(points, 150, 200),
                unit: "s"
            }
        },
        trafficSources: [
            { source: "Direct", value: 45, color: "#fbbf24" },
            { source: "Google", value: 30, color: "#ef4444" },
            { source: "Social", value: 15, color: "#3b82f6" },
            { source: "Referral", value: 10, color: "#10b981" }
        ],
        geoDistribution: [
            { region: "Arizona, US", visitors: 2500 * multiplier },
            { region: "California, US", visitors: 850 * multiplier },
            { region: "Texas, US", visitors: 420 * multiplier },
            { region: "New York, US", visitors: 310 * multiplier },
            { region: "Other", visitors: 120 * multiplier }
        ]
    };

    return NextResponse.json(data);
}
