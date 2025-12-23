import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    console.log('🔍 Checking database connection and data...\n');

    try {
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connection successful!\n');

        // Check meal count
        const mealCount = await prisma.meal.count();
        console.log(`📊 Meals in database: ${mealCount}`);

        if (mealCount > 0) {
            console.log('\n✅ Meals are already seeded!');
            console.log('   You can view them at: http://localhost:3000/menu\n');

            // Show some sample meals
            const meals = await prisma.meal.findMany({
                take: 5,
                select: {
                    title: true,
                    price: true,
                    available: true,
                    featured: true
                }
            });

            console.log('📋 Sample meals:');
            meals.forEach(meal => {
                const status = meal.available ? '✅' : '❌';
                const featured = meal.featured ? '⭐' : '  ';
                console.log(`   ${status} ${featured} ${meal.title} - $${meal.price}`);
            });
        } else {
            console.log('\n⚠️  No meals found in database.');
            console.log('   Run: npx tsx scripts/seed-meals.ts\n');
        }

        // Check user count
        const userCount = await prisma.user.count();
        console.log(`\n👥 Users in database: ${userCount}`);

        if (userCount > 0) {
            const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
            console.log(`   Admin users: ${adminCount}`);
        }

        console.log('\n✅ Database check complete!\n');

    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error('   Error:', error);
        console.log('\n💡 Fix your .env.local file with valid Supabase credentials.\n');
        process.exit(1);
    }
}

checkDatabase()
    .catch((e) => {
        console.error('❌ Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
