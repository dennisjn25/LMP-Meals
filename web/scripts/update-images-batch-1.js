const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.meal.updateMany({
        where: { title: 'Lemon herb chicken' },
        data: { image: '/meals/lemon_herb_chicken.png' }
    });
    console.log('Updated Lemon herb chicken');

    await prisma.meal.updateMany({
        where: { title: 'Chicken fajita bowl' },
        data: { image: '/meals/chicken_fajita_bowl.png' }
    });
    console.log('Updated Chicken fajita bowl');

    await prisma.meal.updateMany({
        where: { title: 'Turkey breakfast scramble' },
        data: { image: '/meals/turkey_breakfast_scramble.png' }
    });
    console.log('Updated Turkey breakfast scramble');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
