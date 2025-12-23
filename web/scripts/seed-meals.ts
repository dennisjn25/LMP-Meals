import { PrismaClient } from '../src/generated/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Use relative path to find the data file (works in dev and prod if files are copied)
const DATA_FILE = path.join(process.cwd(), 'scripts', 'meals-data.json');

async function main() {
    console.log('🌱 Seeding meals from JSON data...');
    console.log(`   Reading from: ${DATA_FILE}`);

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Error: meals-data.json not found!');
        process.exit(1);
    }

    const mealsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Delete existing meals
    await prisma.meal.deleteMany({});
    console.log('✅ Cleared existing meals\n');

    // Create new meals
    for (const meal of mealsData) {
        // We strip the ID if we want new IDs generated, or keep them if we want to preserve history.
        // For fresh production seed, it's often safer to let Prisma/DB generate IDs, 
        // BUT if we have existing images linked to these IDs, we might want to keep specific logic.
        // However, the JSON has `image` paths which are what matters.
        // We will remove `id`, `createdAt`, `updatedAt` to let them be re-generated.

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...mealData } = meal;

        const created = await prisma.meal.create({
            data: {
                ...mealData,
                // Ensure required fields are present (fallback if missing)
                available: meal.available ?? true,
                featured: meal.featured ?? false,
                image: meal.image || '/meals/meal-placeholder.jpg'
            },
        });

        console.log(`✅ Created: ${created.title}`);
        console.log(`   ${created.calories} cal | ${created.protein}g P | ${created.carbs}g C | ${created.fat}g F`);
    }

    console.log(`\n🎉 Successfully seeded ${mealsData.length} meals!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
