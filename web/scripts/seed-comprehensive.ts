import { PrismaClient } from '../src/generated/client';
import * as readline from 'readline';
import { getConfig, checkEnvironmentSafety, SeedConfig } from './seed-config';
import { formatDuration } from './seed-utils';
import {
    seedCustomers,
    seedEmployees,
    seedPromoCodes,
    seedOrders,
    seedDeliveries,
    seedRoutes,
    seedAuditLogs,
} from './seed-generators';

const prisma = new PrismaClient();

/**
 * Comprehensive Database Seeding Script
 * 
 * This script seeds the database with realistic test data for all entities.
 * 
 * Usage:
 *   npm run seed-comprehensive              # Uses minimal config
 *   SEED_CONFIG=small npm run seed-comprehensive
 *   SEED_CONFIG=development npm run seed-comprehensive
 * 
 * Safety:
 *   - Automatically detects production environments
 *   - Requires confirmation before seeding
 *   - Supports incremental seeding (won't duplicate existing records)
 */

function printBanner() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║        🌱 Comprehensive Database Seeding System 🌱             ║');
    console.log('║                                                                ║');
    console.log('║              Liberty Meal Prep - Test Data Generator          ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
}

function printConfig(config: SeedConfig) {
    console.log('📋 Seeding Configuration:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Config Type: ${process.env.SEED_CONFIG || 'minimal'}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📊 Volumes:');
    console.log(`      • Customers:   ${config.volumes.customers.toLocaleString()}`);
    console.log(`      • Employees:   ${config.volumes.employees.toLocaleString()}`);
    console.log(`      • Meals:       ${config.volumes.meals.toLocaleString()}`);
    console.log(`      • Orders:      ${config.volumes.orders.toLocaleString()}`);
    console.log(`      • Promo Codes: ${config.volumes.promoCodes.toLocaleString()}`);
    console.log(`      • Deliveries:  ${config.volumes.deliveries.toLocaleString()}`);
    console.log(`      • Routes:      ${config.volumes.routes.toLocaleString()}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📅 Date Range:');
    console.log(`      From: ${config.dateRange.startDate.toLocaleDateString()}`);
    console.log(`      To:   ${config.dateRange.endDate.toLocaleDateString()}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n');
}

async function confirmSeeding(): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question('⚠️  This will add data to your database. Continue? (yes/no): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

async function getDatabaseStats() {
    const [
        userCount,
        employeeCount,
        mealCount,
        orderCount,
        promoCodeCount,
        deliveryCount,
        routeCount,
        auditLogCount,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.employee.count(),
        prisma.meal.count(),
        prisma.order.count(),
        prisma.promoCode.count(),
        prisma.delivery.count(),
        prisma.route.count(),
        prisma.auditLog.count(),
    ]);

    return {
        userCount,
        employeeCount,
        mealCount,
        orderCount,
        promoCodeCount,
        deliveryCount,
        routeCount,
        auditLogCount,
    };
}

function printStats(before: any, after: any, duration: number) {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║                    🎉 Seeding Complete! 🎉                     ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log(`⏱️  Total Duration: ${formatDuration(duration)}`);
    console.log('\n');
    console.log('📊 Database Statistics:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Entity          Before    After     Added');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const entities = [
        { name: 'Users', before: before.userCount, after: after.userCount },
        { name: 'Employees', before: before.employeeCount, after: after.employeeCount },
        { name: 'Meals', before: before.mealCount, after: after.mealCount },
        { name: 'Orders', before: before.orderCount, after: after.orderCount },
        { name: 'Promo Codes', before: before.promoCodeCount, after: after.promoCodeCount },
        { name: 'Deliveries', before: before.deliveryCount, after: after.deliveryCount },
        { name: 'Routes', before: before.routeCount, after: after.routeCount },
        { name: 'Audit Logs', before: before.auditLogCount, after: after.auditLogCount },
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

    // Safety check
    if (!checkEnvironmentSafety()) {
        console.error('❌ Seeding aborted for safety reasons.\n');
        process.exit(1);
    }

    // Get configuration
    const config = getConfig();
    printConfig(config);

    // Confirm if required
    if (config.environment.requireConfirmation) {
        const confirmed = await confirmSeeding();
        if (!confirmed) {
            console.log('\n❌ Seeding cancelled by user.\n');
            process.exit(0);
        }
    }

    console.log('\n🚀 Starting comprehensive database seeding...\n');
    const startTime = Date.now();

    // Get initial stats
    const statsBefore = await getDatabaseStats();

    try {
        // Seed in order of dependencies

        // 1. Independent entities (no foreign keys)
        await seedCustomers(config);
        await seedEmployees(config);

        // Note: Meals should already exist from meals-data.json
        // If not, you can add a seedMeals function here

        await seedPromoCodes(config);

        // 2. Orders (depends on users and meals)
        await seedOrders(config);

        // 3. Deliveries (depends on orders)
        await seedDeliveries(config);

        // 4. Routes (depends on deliveries and drivers)
        await seedRoutes(config);

        // 5. Audit logs (depends on users and entities)
        await seedAuditLogs(config);

        // Get final stats
        const statsAfter = await getDatabaseStats();
        const duration = Date.now() - startTime;

        printStats(statsBefore, statsAfter, duration);

        console.log('💡 Tips:');
        console.log('   • View data in Prisma Studio: npx prisma studio');
        console.log('   • Run specific seeds: npm run seed-customers');
        console.log('   • Change config: SEED_CONFIG=small npm run seed-comprehensive');
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        console.error('\n💡 Troubleshooting:');
        console.error('   • Check database connection');
        console.error('   • Ensure schema is up to date: npx prisma db push');
        console.error('   • Check for unique constraint violations');
        console.error('\n');
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
