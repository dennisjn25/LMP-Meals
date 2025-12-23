const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Chicken buffalo ranch' },
        data: { image: '/meals/chicken_buffalo_ranch.png' }
    });
    console.log('Updated Chicken buffalo ranch');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
