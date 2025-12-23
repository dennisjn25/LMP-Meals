const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('Liberty_MealPrep_Operations.xlsx');

// Get all sheet names
const sheetNames = workbook.SheetNames;
console.log('Available sheets:', sheetNames);
console.log('\n===========================================\n');

// Parse each sheet
sheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---\n`);
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    // Pretty print the data
    console.log(JSON.stringify(data, null, 2));
    console.log('\n===========================================\n');
});

// Save to a JSON file for easier processing
const allData = {};
sheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    allData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
});

fs.writeFileSync('meal-data.json', JSON.stringify(allData, null, 2));
console.log('\n✅ Data saved to meal-data.json');
