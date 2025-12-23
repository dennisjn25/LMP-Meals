const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Turkey bolognese Banza' },
        data: { image: '/meals/turkey_bolognese.png' }
    });
    console.log('Updated Turkey bolognese Banza');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
