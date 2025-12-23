
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        {
            title: 'Lemon herb chicken',
            image: '/meals/lemon_herb_chicken_prep_container_1766428565964.png'
        },
        {
            title: 'Chicken fajita bowl',
            image: '/meals/chicken_fajita_bowl_prep_container_1766428583169.png'
        },
        {
            title: 'Turkey breakfast scramble',
            image: '/meals/turkey_breakfast_scramble_prep_container_1766428602364.png'
        }
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
