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

        // Find the sheet with meal data
        let mealSheet = null;
        let sheetName = null;

        for (const name of workbook.SheetNames) {
            const sheet = workbook.Sheets[name];
            const data = XLSX.utils.sheet_to_json(sheet);
            if (data.length > 0 && data[0]['Meal']) {
                mealSheet = sheet;
                sheetName = name;
                break;
            }
        }

        if (!mealSheet) {
            console.error('Could not find sheet with "Meal" column');
            return;
        }

        console.log(`Using sheet: ${sheetName}\n`);

        const data = XLSX.utils.sheet_to_json(mealSheet);
        console.log(`Found ${data.length} meals in Excel file\n`);

        // Clear existing meals
        const existingCount = await prisma.meal.count();
        if (existingCount > 0) {
            console.log(`Clearing ${existingCount} existing meals...`);
            await prisma.meal.deleteMany({});
        }

        let imported = 0;
        let skipped = 0;

        for (const row of data) {
            if (!row['Meal']) {
                skipped++;
                continue;
            }

            const title = row['Meal'];
            const calories = parseInt(row['Calories'] || row['Calories_per_meal'] || 500);
            const protein = parseInt(row['Protein_g'] || row['Protein'] || 35);
            const carbs = parseInt(row['Carbohydrate_g'] || row['Carbs'] || 40);
            const fat = parseInt(row['Fat_g'] || row['Fat'] || 15);
            const servingSize = row['Serving_size'] || '16 oz';

            // Determine category based on macros
            const category = determineCategory(protein, carbs, fat);

            // Generate tags based on characteristics
            const tags = [];
            if (protein > 40) tags.push('High Protein');
            if (carbs < 20) tags.push('Keto', 'Low Carb');
            if (fat < 10) tags.push('Low Fat');
            tags.push('GF'); // Assuming gluten-free

            // Create description
            const description = `${servingSize} serving. ${calories} calories with ${protein}g protein, ${carbs}g carbs, and ${fat}g fat.`;

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
                console.log(`✅ ${imported}. ${title} (${category})`);
            } catch (error) {
                console.error(`❌ Error importing ${title}:`, error.message);
                skipped++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`✅ Import Complete!`);
        console.log(`   Imported: ${imported} meals`);
        console.log(`   Skipped: ${skipped} rows`);
        console.log('='.repeat(60));

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

        console.log('\nCategory breakdown:');
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} meals`);
        });

        console.log('\n💡 Next steps:');
        console.log('  1. Refresh the admin meals page');
        console.log('  2. Select 5 meals as featured (this week\'s menu)');
        console.log('  3. Add actual meal images to /public/meals/');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importMealsFromExcel();
