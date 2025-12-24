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
            _count: {
                select: {
                    orders: true,
                    deliveries: true,
                    routes: true
                }
            }
        }
    });

    console.log('--- JOSH ACCOUNTS SUMMARY ---');
    joshAccounts.forEach(acc => {
        console.log(`ID: ${acc.id}`);
        console.log(`Email: ${acc.email}`);
        console.log(`Role: ${acc.role}`);
        console.log(`Orders: ${acc._count.orders}`);
        console.log(`Deliveries: ${acc._count.deliveries}`);
        console.log(`Routes: ${acc._count.routes}`);
        console.log('---');
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
