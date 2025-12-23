const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Chicken parmesan light Banza' },
        data: { image: '/meals/chicken_parmesan.png' }
    });
    console.log('Updated Chicken parmesan light Banza');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
