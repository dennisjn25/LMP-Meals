const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Turkey shepherd pie' },
        data: { image: '/meals/turkey_shepherd_pie.png' }
    });
    console.log('Updated Turkey shepherd pie');

    await prisma.meal.updateMany({
        where: { title: 'Beef burrito bowl' },
        data: { image: '/meals/beef_burrito_bowl.png' }
    });
    console.log('Updated Beef burrito bowl');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
