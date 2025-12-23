const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Beef Korean bowl' },
        data: { image: '/meals/beef_korean_bowl.png' }
    });
    console.log('Updated Beef Korean bowl');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
