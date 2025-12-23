const XLSX = require('xlsx');
const path = require('path');

async function analyzeExcel() {
    try {
        const excelPath = path.join(__dirname, '../../Liberty_MealPrep_Operations.xlsx');
        console.log('Analyzing Excel file:', excelPath);

        const workbook = XLSX.readFile(excelPath);

        console.log('\n📊 All Sheets:');
        workbook.SheetNames.forEach((name, index) => {
            const sheet = workbook.Sheets[name];
            const data = XLSX.utils.sheet_to_json(sheet);
            console.log(`\n${index + 1}. ${name}`);
            console.log(`   Rows: ${data.length}`);

            if (data.length > 0) {
                console.log('   Columns:', Object.keys(data[0]).join(', '));

                // Check for unique meals
                if (data[0]['Meal']) {
                    const uniqueMeals = [...new Set(data.map(row => row['Meal']))];
                    console.log(`   Unique meals: ${uniqueMeals.length}`);

                    if (uniqueMeals.length <= 25) {
                        console.log('\n   Meals in this sheet:');
                        uniqueMeals.forEach((meal, i) => {
                            console.log(`     ${i + 1}. ${meal}`);
                        });
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

analyzeExcel();
