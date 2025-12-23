
import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    const meals = await prisma.meal.findMany()
    fs.writeFileSync('meals_dump_clean.json', JSON.stringify(meals, null, 2), 'utf8')
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
