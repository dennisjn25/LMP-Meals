import { PrismaClient } from '../src/generated/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    console.log('--- ADMIN USERS ---');
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });
    console.log(JSON.stringify(admins, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
