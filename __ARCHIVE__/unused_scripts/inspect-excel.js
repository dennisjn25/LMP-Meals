const XLSX = require('xlsx');
const path = require('path');

async function inspectExcel() {
    try {
        const excelPath = path.join(__dirname, '../../Liberty_MealPrep_Operations.xlsx');
        console.log('Reading Excel file from:', excelPath);

        const workbook = XLSX.readFile(excelPath);

        console.log('\n📊 Sheets in workbook:');
        workbook.SheetNames.forEach((name, index) => {
            console.log(`  ${index + 1}. ${name}`);
        });

        // Check each sheet
        for (const sheetName of workbook.SheetNames) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`Sheet: ${sheetName}`);
            console.log('='.repeat(60));

            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            console.log(`Rows: ${data.length}`);

            if (data.length > 0) {
                console.log('\nColumn names:');
                Object.keys(data[0]).forEach(col => {
                    console.log(`  - ${col}`);
                });

                console.log('\nFirst 3 rows sample:');
                data.slice(0, 3).forEach((row, i) => {
                    console.log(`\nRow ${i + 1}:`);
                    Object.entries(row).forEach(([key, value]) => {
                        console.log(`  ${key}: ${value}`);
                    });
                });
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

inspectExcel();
