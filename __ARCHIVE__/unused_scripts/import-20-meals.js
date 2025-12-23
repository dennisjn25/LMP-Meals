const XLSX = require('xlsx');
const { PrismaClient } = require('../src/generated/client');
const path = require('path');

const prisma = new PrismaClient();

// Category mapping based on meal characteristics
function determineCategory(protein, carbs, fat) {
    const totalMacros = protein + carbs + fat;
    const proteinPercent = (protein * 4 / (totalMacros * 4)) * 100;
    const carbPercent = (carbs * 4 / (totalMacros * 4)) * 100;

    if (proteinPercent > 40) return 'High Protein';
    if (carbPercent < 20) return 'Keto';
    if (Math.abs(proteinPercent - carbPercent) < 10) return 'Balanced';
    return 'Balanced';
}

async function importMealsFromExcel() {
    try {
        const excelPath = path.join(__dirname, '../../Liberty_MealPrep_Operations.xlsx');
        console.log('Reading Excel file from:', excelPath);

        const workbook = XLSX.readFile(excelPath);

        // Use Weekly_Production sheet which has exactly 20 meals
        const sheetName = 'Weekly_Production';
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            console.error('Could not find Weekly_Production sheet');
            return;
        }

        console.log(`Using sheet: ${sheetName}\n`);

        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(`Found ${data.length} meals in Excel file\n`);

        // Clear existing meals
        const existingCount = await prisma.meal.count();
        if (existingCount > 0) {
            console.log(`Clearing ${existingCount} existing meals...\n`);
            await prisma.meal.deleteMany({});
        }

        let imported = 0;
        const seenMeals = new Set();

        for (const row of data) {
            if (!row['Meal']) {
                continue;
            }

            const title = row['Meal'];

            // Skip duplicates
            if (seenMeals.has(title)) {
                console.log(`⏭️  Skipping duplicate: ${title}`);
                continue;
            }
            seenMeals.add(title);

            const calories = parseInt(row['Calories'] || 500);
            const protein = parseInt(row['Protein_g'] || 35);
            const carbs = parseInt(row['Carbs_g'] || 40);
            const fat = parseInt(row['Fat_g'] || 15);
            const servingSize = '16 oz'; // Standard serving size

            // Determine category based on macros
            const category = determineCategory(protein, carbs, fat);

            // Generate tags based on characteristics
            const tags = [];
            if (protein > 40) tags.push('High Protein');
            if (carbs < 20) tags.push('Keto', 'Low Carb');
            if (fat < 10) tags.push('Low Fat');
            tags.push('GF'); // Assuming gluten-free

            // Create description
            const description = `${servingSize} serving with ${calories} calories, ${protein}g protein, ${carbs}g carbs, and ${fat}g fat. Freshly prepared daily.`;

            // Assign image (cycle through available images)
            const imageIndex = (imported % 5) + 1;
            const image = `/meals/meal-${imageIndex}.jpg`;

            // Default price based on category
            let price = 13.99;
            if (category === 'High Protein') price = 14.99;
            if (category === 'Keto') price = 15.99;

            try {
                await prisma.meal.create({
                    data: {
                        title,
                        description,
                        image,
                        price,
                        calories,
                        protein,
                        carbs,
                        fat,
                        tags: tags.join(','),
                        category,
                        available: true,
                        featured: false
                    }
                });

                imported++;
                console.log(`✅ ${imported}. ${title}`);
                console.log(`   ${category} | ${calories} cal | ${protein}g P | ${carbs}g C | ${fat}g F | $${price}`);
            } catch (error) {
                console.error(`❌ Error importing ${title}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log(`✅ Import Complete!`);
        console.log(`   Imported: ${imported} unique meals`);
        console.log('='.repeat(70));

        // Show summary
        const totalMeals = await prisma.meal.count();
        console.log(`\nTotal meals in database: ${totalMeals}`);

        // Show categories breakdown
        const meals = await prisma.meal.findMany({
            select: { category: true }
        });

        const categoryCounts = meals.reduce((acc, meal) => {
            acc[meal.category] = (acc[meal.category] || 0) + 1;
            return acc;
        }, {});

        console.log('\n📊 Category breakdown:');
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} meals`);
        });

        console.log('\n💡 Next steps:');
        console.log('   1. Refresh the admin meals page');
        console.log('   2. Add the star button (see WEEKLY_MENU_GUIDE.md)');
        console.log('   3. Click stars on 5 meals to feature them for this week');
        console.log('   4. Customers will only see the 5 featured meals');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importMealsFromExcel();
