
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        {
            title: 'Turkey shepherd pie',
            image: '/meals/turkey_shepherd_pie_prep_container_retry_1766428683785.png'
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
