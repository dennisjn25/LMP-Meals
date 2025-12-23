
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Update Grilled Chicken
    await prisma.meal.updateMany({
        where: { title: 'Grilled Chicken & Turmeric Rice' },
        data: { image: '/meals/grilled_chicken_rice_1766022747487.png' }
    })
    console.log('Updated Grilled Chicken')

    // Update Turkey Meatballs
    await prisma.meal.updateMany({
        where: { title: 'Lean Turkey Meatballs & Zucchini' },
        data: { image: '/meals/turkey_meatballs_marinara_1766022812297.png' }
    })
    console.log('Updated Turkey Meatballs')

}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
