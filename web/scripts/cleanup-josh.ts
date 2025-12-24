import { PrismaClient } from '../src/generated/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    try {
        const deleted = await prisma.user.delete({
            where: { id: 'cmjixdw5s0003njjk3hbalr1f' }
        });
        console.log('✅ Deleted account with 0 orders:', deleted.email);
    } catch (e) {
        console.log('❌ Could not delete account (it might have relations I missed):', e);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
