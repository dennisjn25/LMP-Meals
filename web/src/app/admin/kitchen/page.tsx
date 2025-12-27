import KitchenDashboard from "@/components/admin/KitchenDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kitchen Dashboard | Liberty Meal Prep",
};

export default function KitchenPage() {
    return <KitchenDashboard />;
}
