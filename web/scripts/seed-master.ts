import { PrismaClient } from '../src/generated/client';
import { execSync } from 'child_process';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Master Seeding Script
 * 
 * Seeds all required data for the website to function correctly.
 * Runs individual seed scripts in the correct order to maintain referential integrity.
 */

function printBanner() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║        🌱 Liberty Meal Prep - Master Seeding Script 🌱        ║');
    console.log('║                                                                ║');
    console.log('║              Seeding all required data in order...            ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
}

function runCommand(command: string, description: string) {
    console.log(`\n📦 ${description}...`);
    console.log(`   Running: ${command}\n`);

    try {
        execSync(command, {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        console.log(`\n✅ ${description} - Complete!\n`);
        return true;
    } catch (error) {
        console.error(`\n❌ ${description} - Failed!`);
        console.error(`   Error:`, error);
        return false;
    }
}

async function checkDatabaseConnection() {
    console.log('🔍 Checking database connection...\n');

    try {
        await prisma.$connect();
        console.log('✅ Database connection successful!\n');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error('   Please check your .env.local file and ensure DATABASE_URL is correct.\n');
        console.error('   Error:', error);
        return false;
    }
}

async function getDatabaseStats() {
    const [
        userCount,
        employeeCount,
        mealCount,
        orderCount,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.employee.count(),
        prisma.meal.count(),
        prisma.order.count(),
    ]);

    return {
        userCount,
        employeeCount,
        mealCount,
        orderCount,
    };
}

function printStats(before: any, after: any) {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║                    🎉 Seeding Complete! 🎉                     ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log('📊 Database Statistics:\n');
    console.log('   Entity          Before    After     Added');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const entities = [
        { name: 'Users', before: before.userCount, after: after.userCount },
        { name: 'Employees', before: before.employeeCount, after: after.employeeCount },
        { name: 'Meals', before: before.mealCount, after: after.mealCount },
        { name: 'Orders', before: before.orderCount, after: after.orderCount },
    ];

    entities.forEach(entity => {
        const added = entity.after - entity.before;
        const beforeStr = entity.before.toString().padStart(8);
        const afterStr = entity.after.toString().padStart(8);
        const addedStr = `+${added}`.padStart(8);
        console.log(`   ${entity.name.padEnd(14)} ${beforeStr}  ${afterStr}  ${addedStr}`);
    });

    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n');
}

async function main() {
    printBanner();

    // Check database connection first
    const connected = await checkDatabaseConnection();
    if (!connected) {
        console.log('\n💡 Troubleshooting Tips:');
        console.log('   1. Check your .env.local file exists');
        console.log('   2. Verify DATABASE_URL and DIRECT_URL are correct');
        console.log('   3. Ensure your Supabase database is active');
        console.log('   4. Try running: npx prisma db pull\n');
        process.exit(1);
    }

    // Get initial stats
    const statsBefore = await getDatabaseStats();

    console.log('📋 Seeding Plan:\n');
    console.log('   1️⃣  Meals (22 meals)');
    console.log('   2️⃣  Customers (6 users including 2 admins)');
    console.log('   3️⃣  Employees (6 employees)');
    console.log('\n');

    let success = true;

    // Step 1: Seed Meals (CRITICAL - Required for orders)
    success = runCommand('tsx scripts/seed-meals.ts', 'Step 1: Seeding Meals');
    if (!success) {
        console.error('\n❌ Seeding failed at Step 1 (Meals)');
        process.exit(1);
    }

    // Step 2: Seed Customers (CRITICAL - Required for admin access)
    success = runCommand('tsx scripts/seed-customers.ts', 'Step 2: Seeding Customers');
    if (!success) {
        console.error('\n❌ Seeding failed at Step 2 (Customers)');
        process.exit(1);
    }

    // Step 3: Seed Employees (IMPORTANT - Required for employee management)
    success = runCommand('tsx scripts/seed-employees.ts', 'Step 3: Seeding Employees');
    if (!success) {
        console.error('\n❌ Seeding failed at Step 3 (Employees)');
        process.exit(1);
    }

    // Get final stats
    const statsAfter = await getDatabaseStats();
    printStats(statsBefore, statsAfter);

    console.log('🔐 Admin Credentials:\n');
    console.log('   Justin Dowd (Owner & CEO)');
    console.log('   • Email: admin@lmpmeals.com');
    console.log('   • Password: LMP2024Admin!\n');
    console.log('   Josh Dennis (COO)');
    console.log('   • Email: josh@lmpmeals.com');
    console.log('   • Password: LMP2024COO!\n');
    console.log('   ⚠️  IMPORTANT: Change these passwords after first login!\n');

    console.log('💡 Next Steps:\n');
    console.log('   • Validate database: npm run validate-db');
    console.log('   • View data: npx prisma studio');
    console.log('   • Test admin login at: http://localhost:3000/admin');
    console.log('   • Change default passwords');
    console.log('\n');
}

main()
    .catch((e) => {
        console.error('❌ Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
