import { PrismaClient } from '../src/generated/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    const joshAccounts = await prisma.user.findMany({
        where: {
            OR: [
                { email: 'Josh@lmpmeals.com' },
                { email: 'josh@lmpmeals.com' }
            ]
        },
        include: {
            orders: true,
            deliveries: true,
            routes: true
        }
    });

    console.log('--- JOSH ACCOUNTS ---');
    console.log(JSON.stringify(joshAccounts, (key, value) =>
        (key === 'password' ? '********' : value), 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
