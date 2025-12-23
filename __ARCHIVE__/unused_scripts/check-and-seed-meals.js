const { PrismaClient } = require('../src/generated/client');

const prisma = new PrismaClient();

async function checkAndSeedMeals() {
    try {
        // Check if meals exist
        const mealCount = await prisma.meal.count();
        console.log(`Current meal count: ${mealCount}`);

        if (mealCount === 0) {
            console.log('No meals found. Seeding database...');

            const MEALS = [
                {
                    title: "Grilled Chicken & Turmeric Rice",
                    image: "/meals/meal-1.jpg",
                    calories: 450,
                    protein: 45,
                    carbs: 35,
                    fat: 12,
                    price: 13.99,
                    tags: "High Protein,GF",
                    category: "Balanced",
                    description: "Tender grilled chicken breast served with aromatic turmeric rice and seasonal vegetables.",
                    available: true,
                    featured: false
                },
                {
                    title: "Steak & Sweet Potato Mash",
                    image: "/meals/meal-2.jpg",
                    calories: 520,
                    protein: 48,
                    carbs: 40,
                    fat: 18,
                    price: 15.99,
                    tags: "Bulking,GF",
                    category: "High Protein",
                    description: "Juicy steak slices paired with creamy sweet potato mash for the ultimate post-workout fuel.",
                    available: true,
                    featured: false
                },
                {
                    title: "Lean Turkey Meatballs & Zucchini",
                    image: "/meals/meal-3.jpg",
                    calories: 380,
                    protein: 35,
                    carbs: 12,
                    fat: 18,
                    price: 13.99,
                    tags: "Keto,Low Carb",
                    category: "Keto",
                    description: "Flavorful turkey meatballs served over spiralized zucchini noodles.",
                    available: true,
                    featured: false
                },
                {
                    title: "Salmon & Asparagus",
                    image: "/meals/meal-4.jpg",
                    calories: 420,
                    protein: 38,
                    carbs: 10,
                    fat: 22,
                    price: 16.99,
                    tags: "Keto,GF,Omega-3",
                    category: "Keto",
                    description: "Fresh Atlantic salmon fillet grilled to perfection with crisp asparagus spears.",
                    available: true,
                    featured: false
                },
                {
                    title: "Teriyaki Chicken Bowl",
                    image: "/meals/meal-5.jpg",
                    calories: 480,
                    protein: 42,
                    carbs: 45,
                    fat: 10,
                    price: 13.99,
                    tags: "Balanced,Dairy Free",
                    category: "Balanced",
                    description: "Classic teriyaki chicken thigh glazed in house-made sauce served with jasmine rice.",
                    available: true,
                    featured: false
                }
            ];

            for (const meal of MEALS) {
                await prisma.meal.create({ data: meal });
                console.log(`Created: ${meal.title}`);
            }

            console.log('\n✅ Database seeded successfully!');
            console.log(`Total meals: ${await prisma.meal.count()}`);
        } else {
            console.log('✅ Meals already exist in database');

            // List all meals
            const meals = await prisma.meal.findMany({
                select: { id: true, title: true, featured: true, featuredOrder: true }
            });

            console.log('\nCurrent meals:');
            meals.forEach(meal => {
                const featuredInfo = meal.featured ? ` [FEATURED #${meal.featuredOrder}]` : '';
                console.log(`  - ${meal.title}${featuredInfo}`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndSeedMeals();
