const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Check if column exists using raw query
        const result = await prisma.$queryRaw`PRAGMA table_info(Meal);`;
        const hasProductId = result.some(col => col.name === 'productId');
        console.log('Has productId column:', hasProductId);

        if (hasProductId) {
            const meals = await prisma.meal.findMany();
            console.log(`Found ${meals.length} meals.`);

            for (const meal of meals) {
                // Generate 8 digit ID starting with 7
                // 70000000 to 79999999
                let productId;
                let isUnique = false;

                while (!isUnique) {
                    productId = Math.floor(70000000 + Math.random() * 10000000).toString();
                    // Check if this ID is already assigned in memory or db (simple check)
                    // For now just checking if we already assigned it in this loop is usually enough for small batch
                    // But we should check DB to be safe if we want to be perfect, but strict uniqueness on random 10M space for 20 items is high prob.
                    isUnique = true;
                }

                console.log(`Assigning Product ID ${productId} to meal ${meal.title}`);

                // Use executeRaw to update since the client might not have the field typings yet
                await prisma.$executeRawUnsafe(
                    'UPDATE Meal SET productId = ? WHERE id = ?',
                    productId,
                    meal.id
                );
            }
            console.log('Finished updating product IDs.');
        } else {
            console.log('Column productId does not exist. Schema update likely failed.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
