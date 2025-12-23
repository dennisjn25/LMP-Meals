const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const meals = await prisma.meal.findMany();
    const images = meals.map(m => m.image);
    const duplicates = images.filter((item, index) => images.indexOf(item) !== index);

    if (duplicates.length > 0) {
        console.log('Duplicate Images in Meals:', [...new Set(duplicates)]);
        const counts = {};
        meals.forEach(m => {
            counts[m.image] = (counts[m.image] || 0) + 1;
        });
        console.log('Image Counts:');
        Object.entries(counts).forEach(([img, count]) => {
            if (count > 1) {
                console.log(`${img}: ${count} occurrences`);
                const associatedMeals = meals.filter(m => m.image === img).map(m => m.title);
                console.log(`  Meals: ${associatedMeals.join(', ')}`);
            }
        });
    } else {
        console.log('No duplicate images found in Meals.');
    }

    // Also check for files in public/meals that are the same (by content/hash)
    // This might be harder without fs-extra or similar, but I can use fs.
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
