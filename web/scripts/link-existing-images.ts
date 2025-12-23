
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        { title: 'Beef Korean bowl', image: '/meals/beef_korean_bowl.png' },
        { title: 'Chicken buffalo ranch', image: '/meals/chicken_buffalo_ranch.png' },
        { title: 'Chicken parmesan light Banza', image: '/meals/chicken_parmesan.png' },
        { title: 'Turkey bolognese Banza', image: '/meals/turkey_bolognese.png' }
    ]

    for (const update of updates) {
        const result = await prisma.meal.updateMany({
            where: { title: update.title },
            data: { image: update.image }
        })
        if (result.count > 0) {
            console.log(`Updated ${update.title} to use ${update.image}`)
        } else {
            console.log(`Could not find meal ${update.title}`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
