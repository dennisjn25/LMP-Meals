
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
    const fs = require('fs');
    const meals = await prisma.meal.findMany();
    fs.writeFileSync('scripts/meals-data.json', JSON.stringify(meals, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
