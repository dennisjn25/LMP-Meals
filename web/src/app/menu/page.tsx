import { getFeaturedMeals, seedInitialMeals } from "@/actions/meals";
import MenuClient from "@/components/MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
    await seedInitialMeals();
    const meals = await getFeaturedMeals(); // Only show this week's featured meals

    return <MenuClient meals={meals} />;
}
