import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/client';

config({ path: '.env.local' });
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: { contains: 'Josh', mode: 'insensitive' } },
                    { email: { contains: 'josh', mode: 'insensitive' } }
                ]
            }
        });
        console.log('User found:', user);

        const adminUsers = await prisma.user.findMany({
            where: { role: 'ADMIN' }
        });
        console.log('Admin users:', adminUsers);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
