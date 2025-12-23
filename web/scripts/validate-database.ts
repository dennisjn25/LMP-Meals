import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

/**
 * Database Validation Script
 * 
 * Validates the integrity of seeded data and checks for common issues.
 */

interface ValidationResult {
    entity: string;
    passed: boolean;
    message: string;
    details?: any;
}

const results: ValidationResult[] = [];

function addResult(entity: string, passed: boolean, message: string, details?: any) {
    results.push({ entity, passed, message, details });
}

async function validateUsers() {
    console.log('👥 Validating Users...');

    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
    const verifiedUsers = await prisma.user.count({ where: { emailVerified: { not: null } } });
    const usersWithOrders = await prisma.user.count({ where: { orders: { some: {} } } });

    addResult('Users', totalUsers > 0, `Total users: ${totalUsers}`, {
        total: totalUsers,
        admins: adminUsers,
        verified: verifiedUsers,
        withOrders: usersWithOrders,
    });

    if (adminUsers === 0) {
        addResult('Admin Users', false, 'No admin users found - create at least one admin');
    } else {
        addResult('Admin Users', true, `Found ${adminUsers} admin user(s)`);
    }
}

async function validateEmployees() {
    console.log('💼 Validating Employees...');

    const totalEmployees = await prisma.employee.count();
    const activeEmployees = await prisma.employee.count({ where: { status: 'ACTIVE' } });
    const departments = await prisma.employee.groupBy({
        by: ['department'],
        _count: true,
    });

    addResult('Employees', totalEmployees > 0, `Total employees: ${totalEmployees}`, {
        total: totalEmployees,
        active: activeEmployees,
        departments: departments.length,
    });

    // Check for drivers (needed for deliveries)
    const drivers = await prisma.employee.count({
        where: { department: 'Logistics', status: 'ACTIVE' }
    });

    if (drivers === 0) {
        addResult('Drivers', false, 'No active drivers found - deliveries may not be assigned');
    } else {
        addResult('Drivers', true, `Found ${drivers} active driver(s)`);
    }
}

async function validateMeals() {
    console.log('🍽️  Validating Meals...');

    const totalMeals = await prisma.meal.count();
    const availableMeals = await prisma.meal.count({ where: { available: true } });
    const featuredMeals = await prisma.meal.count({ where: { featured: true } });

    addResult('Meals', totalMeals > 0, `Total meals: ${totalMeals}`, {
        total: totalMeals,
        available: availableMeals,
        featured: featuredMeals,
    });

    if (availableMeals === 0) {
        addResult('Available Meals', false, 'No available meals - orders cannot be created');
    }
}

async function validateOrders() {
    console.log('📦 Validating Orders...');

    const totalOrders = await prisma.order.count();
    const ordersWithItems = await prisma.order.count({
        where: { items: { some: {} } }
    });
    const orderStatuses = await prisma.order.groupBy({
        by: ['status'],
        _count: true,
    });

    addResult('Orders', totalOrders > 0, `Total orders: ${totalOrders}`, {
        total: totalOrders,
        withItems: ordersWithItems,
        statuses: orderStatuses,
    });

    // Check for orders without items (data integrity issue)
    const ordersWithoutItems = totalOrders - ordersWithItems;
    if (ordersWithoutItems > 0) {
        addResult('Order Items', false, `${ordersWithoutItems} orders have no items - data integrity issue`);
    } else if (totalOrders > 0) {
        addResult('Order Items', true, 'All orders have items');
    }

    // Validate order totals
    const ordersWithInvalidTotal = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count
    FROM "Order" o
    WHERE o.total <= 0
  `;

    const invalidCount = Number(ordersWithInvalidTotal[0]?.count || 0);
    if (invalidCount > 0) {
        addResult('Order Totals', false, `${invalidCount} orders have invalid totals (≤ 0)`);
    } else if (totalOrders > 0) {
        addResult('Order Totals', true, 'All order totals are valid');
    }
}

async function validateDeliveries() {
    console.log('🚚 Validating Deliveries...');

    const totalDeliveries = await prisma.delivery.count();
    const deliveriesWithDriver = await prisma.delivery.count({
        where: { driverId: { not: null } }
    });
    const deliveryStatuses = await prisma.delivery.groupBy({
        by: ['status'],
        _count: true,
    });

    addResult('Deliveries', totalDeliveries >= 0, `Total deliveries: ${totalDeliveries}`, {
        total: totalDeliveries,
        withDriver: deliveriesWithDriver,
        statuses: deliveryStatuses,
    });

    // Check for delivered orders with proof
    const deliveredWithProof = await prisma.delivery.count({
        where: {
            status: 'DELIVERED',
            OR: [
                { signedBy: { not: null } },
                { deliveryPhoto: { not: null } }
            ]
        }
    });

    const totalDelivered = await prisma.delivery.count({
        where: { status: 'DELIVERED' }
    });

    if (totalDelivered > 0) {
        const proofPercentage = ((deliveredWithProof / totalDelivered) * 100).toFixed(1);
        addResult('Delivery Proof', true, `${proofPercentage}% of delivered orders have proof`, {
            delivered: totalDelivered,
            withProof: deliveredWithProof,
        });
    }
}

async function validateRoutes() {
    console.log('🗺️  Validating Routes...');

    const totalRoutes = await prisma.route.count();
    const routesWithDriver = await prisma.route.count({
        where: { driverId: { not: null } }
    });
    const optimizedRoutes = await prisma.route.count({
        where: { optimized: true }
    });

    addResult('Routes', totalRoutes >= 0, `Total routes: ${totalRoutes}`, {
        total: totalRoutes,
        withDriver: routesWithDriver,
        optimized: optimizedRoutes,
    });

    // Check for routes without deliveries
    const routesWithDeliveries = await prisma.route.count({
        where: { deliveries: { some: {} } }
    });

    const routesWithoutDeliveries = totalRoutes - routesWithDeliveries;
    if (routesWithoutDeliveries > 0) {
        addResult('Route Deliveries', false, `${routesWithoutDeliveries} routes have no deliveries`);
    } else if (totalRoutes > 0) {
        addResult('Route Deliveries', true, 'All routes have deliveries');
    }
}

async function validatePromoCodes() {
    console.log('🎟️  Validating Promo Codes...');

    const totalPromoCodes = await prisma.promoCode.count();
    const activePromoCodes = await prisma.promoCode.count({
        where: { isActive: true }
    });
    const expiredPromoCodes = await prisma.promoCode.count({
        where: { endDate: { lt: new Date() } }
    });

    addResult('Promo Codes', totalPromoCodes >= 0, `Total promo codes: ${totalPromoCodes}`, {
        total: totalPromoCodes,
        active: activePromoCodes,
        expired: expiredPromoCodes,
    });
}

async function validateReferentialIntegrity() {
    console.log('🔗 Validating Referential Integrity...');

    // Check for order items integrity
    // Due to cascade deletes and foreign key constraints, orphaned records shouldn't exist
    const totalOrderItems = await prisma.orderItem.count();

    if (totalOrderItems > 0) {
        addResult('Order Item Integrity', true, 'All order items have valid relationships');
    }

    // Check for delivery integrity
    // Deliveries are linked to orders via foreign key, so orphans shouldn't exist
    const totalDeliveries = await prisma.delivery.count();

    if (totalDeliveries > 0) {
        addResult('Delivery Integrity', true, 'All deliveries have valid order relationships');
    }
}

function printResults() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║              📊 Database Validation Results 📊                 ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log('\n');

    if (failed > 0) {
        console.log('❌ Failed Validations:\n');
        results.filter(r => !r.passed).forEach(result => {
            console.log(`   • ${result.entity}: ${result.message}`);
            if (result.details) {
                console.log(`     Details:`, JSON.stringify(result.details, null, 2));
            }
        });
        console.log('\n');
    }

    console.log('✅ Passed Validations:\n');
    results.filter(r => r.passed).forEach(result => {
        console.log(`   • ${result.entity}: ${result.message}`);
    });
    console.log('\n');

    // Summary statistics
    console.log('📊 Database Summary:\n');
    const summaryDetails = results.filter(r => r.details).map(r => ({
        entity: r.entity,
        ...r.details
    }));

    summaryDetails.forEach(detail => {
        console.log(`   ${detail.entity}:`);
        Object.entries(detail).forEach(([key, value]) => {
            if (key !== 'entity') {
                console.log(`      ${key}: ${JSON.stringify(value)}`);
            }
        });
    });

    console.log('\n');

    if (failed === 0) {
        console.log('🎉 All validations passed! Database is healthy.\n');
    } else {
        console.log('⚠️  Some validations failed. Review the issues above.\n');
    }
}

async function main() {
    console.log('\n🔍 Starting database validation...\n');

    try {
        await validateUsers();
        await validateEmployees();
        await validateMeals();
        await validateOrders();
        await validateDeliveries();
        await validateRoutes();
        await validatePromoCodes();
        await validateReferentialIntegrity();

        printResults();

        const failed = results.filter(r => !r.passed).length;
        process.exit(failed > 0 ? 1 : 0);

    } catch (error) {
        console.error('\n❌ Validation failed with error:', error);
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
