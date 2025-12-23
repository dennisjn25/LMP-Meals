
import { PrismaClient } from '../src/generated/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('All Users:');
    users.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
