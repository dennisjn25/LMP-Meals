import { PrismaClient } from '../src/generated/client';
import * as bcrypt from 'bcryptjs';
import { SeedConfig } from './seed-config';
import {
    randomName,
    generateEmail,
    randomAddress,
    randomCity,
    randomZipCode,
    randomPhone,
    randomDate,
    randomInt,
    randomFloat,
    randomBoolean,
    randomElement,
    generateOrderNumber,
    randomOrderStatus,
    randomDeliveryStatus,
    randomPosition,
    employeePositions,
    generatePromoCode,
    randomCoordinates,
    randomDeliveryNote,
    processBatch,
    progressBar,
} from './seed-utils';

const prisma = new PrismaClient();

/**
 * Seed customers/users with realistic data
 */
export async function seedCustomers(config: SeedConfig): Promise<void> {
    console.log(`\n👥 Seeding ${config.volumes.customers} customers...`);

    const customers = [];
    const batchSize = 100;

    // Always include admin user
    customers.push({
        name: 'Justin Dowd',
        email: 'justin@lmpmeals.com',
        password: await bcrypt.hash('LMP2024Admin!', 10),
        role: 'ADMIN',
        emailVerified: new Date(),
        sendReceiptEmail: true,
    });

    // Generate regular customers
    for (let i = 1; i < config.volumes.customers; i++) {
        const name = randomName();
        customers.push({
            name,
            email: generateEmail(name),
            password: await bcrypt.hash('Customer123!', 10),
            role: 'USER',
            emailVerified: randomBoolean(80) ? new Date() : null,
            sendReceiptEmail: randomBoolean(85),
        });
    }

    // Insert in batches
    await processBatch(
        customers,
        batchSize,
        async (batch) => {
            return await prisma.user.createMany({
                data: batch,
                skipDuplicates: true,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Customers')}`);
        }
    );

    console.log(`   ✅ Created ${config.volumes.customers} customers`);
}

/**
 * Seed employees with realistic data
 */
export async function seedEmployees(config: SeedConfig): Promise<void> {
    console.log(`\n💼 Seeding ${config.volumes.employees} employees...`);

    const employees = [];
    const departments = Object.keys(employeePositions) as Array<keyof typeof employeePositions>;

    for (let i = 0; i < config.volumes.employees; i++) {
        const name = randomName();
        const department = randomElement(departments);
        const position = randomPosition(department);
        const hireDate = randomDate(
            new Date('2020-01-01'),
            new Date()
        );

        employees.push({
            name,
            email: generateEmail(name, 'lmpmeals.com'),
            phone: randomPhone(),
            position,
            department,
            status: randomElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'ON_LEAVE', 'INACTIVE']), // 60% active
            salary: randomFloat(35000, 85000, 0),
            hireDate,
            startDate: hireDate,
            notes: randomBoolean(30) ? `Hired as ${position}` : null,
        });
    }

    await processBatch(
        employees,
        50,
        async (batch) => {
            return await prisma.employee.createMany({
                data: batch,
                skipDuplicates: true,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Employees')}`);
        }
    );

    console.log(`   ✅ Created ${config.volumes.employees} employees`);
}

/**
 * Seed promo codes with realistic data
 */
export async function seedPromoCodes(config: SeedConfig): Promise<void> {
    console.log(`\n🎟️  Seeding ${config.volumes.promoCodes} promo codes...`);

    const promoCodes = [];
    const now = new Date();

    for (let i = 0; i < config.volumes.promoCodes; i++) {
        const startDate = randomDate(config.dateRange.startDate, now);
        const endDate = randomDate(startDate, new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)); // Up to 90 days in future

        const discountType = randomElement(['PERCENTAGE', 'PERCENTAGE', 'FIXED']); // 66% percentage
        const discountValue = discountType === 'PERCENTAGE'
            ? randomInt(5, 50)
            : randomFloat(5, 50, 2);

        promoCodes.push({
            code: generatePromoCode(randomInt(6, 12)),
            discountType,
            discountValue,
            startDate,
            endDate,
            maxRedemptions: randomBoolean(70) ? randomInt(10, 1000) : null,
            currentRedemptions: 0,
            minOrderValue: randomBoolean(50) ? randomFloat(20, 100, 2) : null,
            isActive: randomBoolean(80),
            description: randomBoolean(60) ? `${discountValue}${discountType === 'PERCENTAGE' ? '%' : '$'} off promotion` : null,
        });
    }

    await prisma.promoCode.createMany({
        data: promoCodes,
        skipDuplicates: true,
    });

    console.log(`   ✅ Created ${config.volumes.promoCodes} promo codes`);
}

/**
 * Seed orders with realistic data and relationships
 */
export async function seedOrders(config: SeedConfig): Promise<void> {
    console.log(`\n📦 Seeding ${config.volumes.orders} orders...`);

    // Get all users and meals for relationships
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const meals = await prisma.meal.findMany({ where: { available: true } });

    if (users.length === 0 || meals.length === 0) {
        console.warn('   ⚠️  No users or meals found. Skipping order seeding.');
        return;
    }

    const orders = [];
    const orderItems: Array<{ orderId: string; mealId: string; quantity: number; price: number }> = [];

    for (let i = 0; i < config.volumes.orders; i++) {
        const orderId = `order_${i}_${Date.now()}`;
        const user = randomBoolean(70) ? randomElement(users) : null; // 70% registered, 30% guest
        const orderDate = randomDate(config.dateRange.startDate, config.dateRange.endDate);
        const status = randomOrderStatus(config.orders.percentagePaid, config.orders.percentageCompleted);

        // Generate order items
        const itemCount = randomInt(config.orders.minItemsPerOrder, config.orders.maxItemsPerOrder);
        const selectedMeals = new Set<string>();
        let total = 0;

        for (let j = 0; j < itemCount; j++) {
            let meal = randomElement(meals);
            // Avoid duplicates
            while (selectedMeals.has(meal.id) && selectedMeals.size < meals.length) {
                meal = randomElement(meals);
            }
            selectedMeals.add(meal.id);

            const quantity = randomInt(config.orders.minQuantityPerItem, config.orders.maxQuantityPerItem);
            const price = meal.price;
            total += price * quantity;

            orderItems.push({
                orderId,
                mealId: meal.id,
                quantity,
                price,
            });
        }

        const customerName = user?.name || randomName();

        orders.push({
            id: orderId,
            orderNumber: generateOrderNumber(),
            userId: user?.id || null,
            status,
            total,
            customerName,
            customerEmail: user?.email || generateEmail(customerName),
            customerPhone: randomPhone(),
            shippingAddress: randomAddress(),
            city: randomCity(),
            zipCode: randomZipCode(),
            deliveryDate: randomBoolean(60) ? randomDate(orderDate, new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000)) : null,
            squareOrderId: status !== 'PENDING' ? `sq_order_${randomInt(100000, 999999)}` : null,
            squareCheckoutId: status !== 'PENDING' ? `sq_checkout_${randomInt(100000, 999999)}` : null,
            createdAt: orderDate,
            updatedAt: orderDate,
        });
    }

    // Insert orders in batches
    await processBatch(
        orders,
        100,
        async (batch) => {
            return await prisma.order.createMany({
                data: batch,
                skipDuplicates: true,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Orders')}`);
        }
    );

    // Insert order items in batches
    console.log(`   📝 Creating order items...`);
    await processBatch(
        orderItems,
        500,
        async (batch) => {
            return await prisma.orderItem.createMany({
                data: batch,
                skipDuplicates: true,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Order Items')}`);
        }
    );

    console.log(`   ✅ Created ${config.volumes.orders} orders with ${orderItems.length} items`);
}

/**
 * Seed deliveries with realistic data
 */
export async function seedDeliveries(config: SeedConfig): Promise<void> {
    console.log(`\n🚚 Seeding deliveries...`);

    // Get orders that should have deliveries
    const orders = await prisma.order.findMany({
        where: {
            status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
        },
        take: config.volumes.deliveries,
    });

    if (orders.length === 0) {
        console.warn('   ⚠️  No eligible orders found. Skipping delivery seeding.');
        return;
    }

    // Get drivers (employees in Logistics department)
    const drivers = await prisma.user.findMany({
        where: {
            employee: {
                department: 'Logistics',
                status: 'ACTIVE',
            }
        },
        include: { employee: true }
    });

    const deliveries = [];

    for (const order of orders) {
        const status = randomDeliveryStatus(
            config.deliveries.percentageDelivered,
            config.deliveries.percentageInProgress
        );

        const driver = drivers.length > 0 ? randomElement(drivers) : null;
        const hasProof = status === 'DELIVERED' && randomBoolean(config.deliveries.percentageWithProof);
        const coords = randomCoordinates();

        deliveries.push({
            orderId: order.id,
            driverId: driver?.id || null,
            status,
            signedBy: hasProof ? order.customerName : null,
            deliveryPhoto: hasProof && randomBoolean(60) ? `delivery_${order.orderNumber}.jpg` : null,
            deliveredAt: status === 'DELIVERED' ? randomDate(order.createdAt, new Date()) : null,
            notes: status === 'DELIVERED' ? randomDeliveryNote() : null,
            latitude: hasProof ? coords.latitude : null,
            longitude: hasProof ? coords.longitude : null,
            estimatedArrival: order.deliveryDate || null,
        });
    }

    await processBatch(
        deliveries,
        100,
        async (batch) => {
            return await prisma.delivery.createMany({
                data: batch,
                skipDuplicates: true,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Deliveries')}`);
        }
    );

    console.log(`   ✅ Created ${deliveries.length} deliveries`);
}

/**
 * Seed routes with realistic data
 */
export async function seedRoutes(config: SeedConfig): Promise<void> {
    console.log(`\n🗺️  Seeding ${config.volumes.routes} routes...`);

    // Get drivers
    const drivers = await prisma.user.findMany({
        where: {
            employee: {
                department: 'Logistics',
                status: 'ACTIVE',
            }
        }
    });

    if (drivers.length === 0) {
        console.warn('   ⚠️  No drivers found. Skipping route seeding.');
        return;
    }

    // Get unassigned deliveries
    const unassignedDeliveries = await prisma.delivery.findMany({
        where: { routeId: null },
        include: { order: true }
    });

    const routes = [];
    let deliveryIndex = 0;

    for (let i = 0; i < config.volumes.routes && deliveryIndex < unassignedDeliveries.length; i++) {
        const driver = randomElement(drivers);
        const routeDate = randomDate(config.dateRange.startDate, config.dateRange.endDate);
        const deliveryCount = Math.min(
            randomInt(config.routes.minDeliveriesPerRoute, config.routes.maxDeliveriesPerRoute),
            unassignedDeliveries.length - deliveryIndex
        );

        const routeId = `route_${i}_${Date.now()}`;
        const isOptimized = randomBoolean(config.routes.percentageOptimized);
        const isCompleted = randomBoolean(70);

        routes.push({
            id: routeId,
            driverId: driver.id,
            date: routeDate,
            status: isCompleted ? 'COMPLETED' : randomElement(['PLANNED', 'ACTIVE']),
            optimized: isOptimized,
            totalDistance: isOptimized ? randomFloat(10, 100, 2) : null,
            totalDuration: isOptimized ? randomInt(1800, 14400) : null, // 30min to 4hrs in seconds
        });

        // Assign deliveries to this route
        for (let j = 0; j < deliveryCount; j++) {
            const delivery = unassignedDeliveries[deliveryIndex++];
            await prisma.delivery.update({
                where: { id: delivery.id },
                data: {
                    routeId,
                    sequence: j + 1,
                }
            });
        }
    }

    await prisma.route.createMany({
        data: routes,
        skipDuplicates: true,
    });

    console.log(`   ✅ Created ${routes.length} routes`);
}

/**
 * Seed audit logs for tracking
 */
export async function seedAuditLogs(config: SeedConfig): Promise<void> {
    console.log(`\n📋 Seeding audit logs...`);

    const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' }
    });

    if (adminUsers.length === 0) {
        console.warn('   ⚠️  No admin users found. Skipping audit log seeding.');
        return;
    }

    const employees = await prisma.employee.findMany({ take: 50 });
    const promoCodes = await prisma.promoCode.findMany({ take: 50 });

    const auditLogs = [];
    const actions = [
        'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE',
        'CREATE_PROMO', 'UPDATE_PROMO', 'DELETE_PROMO',
        'UPDATE_ORDER', 'CANCEL_ORDER',
    ];

    // Generate 200-500 audit logs
    const logCount = randomInt(200, 500);

    for (let i = 0; i < logCount; i++) {
        const action = randomElement(actions);
        const admin = randomElement(adminUsers);
        const entityType = action.includes('EMPLOYEE') ? 'EMPLOYEE' :
            action.includes('PROMO') ? 'PROMO_CODE' : 'ORDER';

        let entityId = null;
        if (entityType === 'EMPLOYEE' && employees.length > 0) {
            entityId = randomElement(employees).id;
        } else if (entityType === 'PROMO_CODE' && promoCodes.length > 0) {
            entityId = randomElement(promoCodes).id;
        }

        auditLogs.push({
            action,
            entityType,
            entityId,
            userId: admin.id,
            userName: admin.name,
            details: JSON.stringify({ timestamp: new Date().toISOString() }),
            createdAt: randomDate(config.dateRange.startDate, config.dateRange.endDate),
        });
    }

    await processBatch(
        auditLogs,
        100,
        async (batch) => {
            return await prisma.auditLog.createMany({
                data: batch,
            }).then(() => batch);
        },
        (current, total) => {
            console.log(`   ${progressBar(current, total, 'Audit Logs')}`);
        }
    );

    console.log(`   ✅ Created ${auditLogs.length} audit log entries`);
}
