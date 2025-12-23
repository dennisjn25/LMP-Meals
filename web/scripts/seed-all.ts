import { PrismaClient } from '../src/generated/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * Master seed script that runs all seeding operations in the correct order
 * 
 * Order of operations:
 * 1. Seed customers (users) - must be first as employees may reference users
 * 2. Seed employees
 * 3. Seed meals
 */

async function runScript(scriptName: string, description: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Running: ${description}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
        execSync(`npm run ${scriptName}`, {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        console.log(`\n✅ ${description} completed successfully!\n`);
    } catch (error) {
        console.error(`\n❌ Error running ${description}:`, error);
        throw error;
    }
}

async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║           🌱 Liberty Meal Prep - Database Seeding 🌱       ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n');

    const startTime = Date.now();

    try {
        // 1. Seed customers (users)
        await runScript('seed-customers', 'Customer Seeding');

        // 2. Seed employees
        await runScript('seed-employees', 'Employee Seeding');

        // 3. Seed meals
        await runScript('seed-meals', 'Meal Seeding');

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                                                            ║');
        console.log('║              🎉 All Seeding Complete! 🎉                   ║');
        console.log('║                                                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log(`\n⏱️  Total time: ${duration} seconds\n`);

        // Display summary
        const userCount = await prisma.user.count();
        const employeeCount = await prisma.employee.count();
        const mealCount = await prisma.meal.count();

        console.log('📊 Database Summary:');
        console.log(`   👥 Users: ${userCount}`);
        console.log(`   💼 Employees: ${employeeCount}`);
        console.log(`   🍽️  Meals: ${mealCount}`);
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error('❌ Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
