
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'e:\\Development\\Projects\\Websites\\Liberty-Meal-Prep\\Our Journey Photos';
const DEST_DIR = path.join(__dirname, '../public/journey');

// Ensure destination exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Copy all files
const files = fs.readdirSync(SOURCE_DIR);
files.forEach(file => {
    const srcPath = path.join(SOURCE_DIR, file);
    // clean filename: Prep 1.png -> prep-1.png
    const cleanName = file.toLowerCase().replace(/\s+/g, '-');
    const destPath = path.join(DEST_DIR, cleanName);
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${cleanName}`);
});
