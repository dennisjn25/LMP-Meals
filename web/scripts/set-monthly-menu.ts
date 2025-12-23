import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// December 2024 - Featured 10 Meals
const DECEMBER_2024_MEALS = [
    'Grilled chicken rice bowl',
    'Turkey taco bowl',
    'Beef and potato hash',
    'Chicken pesto pasta Banza',
    'Turkey meatballs marinara Banza',
    'BBQ chicken mash',
    'Turkey chili cup',
    'Greek chicken bowl',
    'Beef enchilada skillet',
    'Chicken alfredo light Banza',
];

async function setMonthlyMenu(featuredMeals: string[]) {
    console.log('🗓️  Setting monthly menu rotation...\n');

    // First, set all meals to unavailable
    await prisma.meal.updateMany({
        data: { available: false },
    });
    console.log('✅ Marked all meals as unavailable\n');

    // Then, set featured meals to available
    for (const mealTitle of featuredMeals) {
        const updated = await prisma.meal.updateMany({
            where: {
                title: mealTitle,
            },
            data: { available: true },
        });

        if (updated.count > 0) {
            console.log(`✅ Featured: ${mealTitle}`);
        } else {
            console.log(`⚠️  Not found: ${mealTitle}`);
        }
    }

    console.log(`\n🎉 Monthly menu set! ${featuredMeals.length} meals now available.`);
}

async function main() {
    await setMonthlyMenu(DECEMBER_2024_MEALS);
}

main()
    .catch((e) => {
        console.error('❌ Error setting monthly menu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
