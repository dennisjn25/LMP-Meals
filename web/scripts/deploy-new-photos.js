
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SOURCE_DIR = 'e:\\Development\\Projects\\Websites\\Liberty-Meal-Prep\\LMP-Meals-Photos';
const DEST_DIR = path.join(__dirname, '../public/meals');

// Ensure destination exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

const MAPPINGS = [
    { dbTitle: "BBQ chicken mash", filename: "BBQ Chicken Mash.png" },
    { dbTitle: "Beef burrito bowl", filename: "Beef Burrito Bowl.png" },
    { dbTitle: "Beef enchilada skillet", filename: "Beef Enchilada Skillet.png" },
    { dbTitle: "Beef Korean bowl", filename: "Beef Korean Bowl.png" },
    { dbTitle: "Beef and potato hash", filename: "Beef amd Potato Hash.png" }, // Typo in filename
    { dbTitle: "Chicken alfredo light Banza", filename: "Chicken Alfredo Light.png" },
    { dbTitle: "Chicken buffalo ranch", filename: "Chicken Buffalo Ranch.png" },
    { dbTitle: "Chicken fajita bowl", filename: "Chicken Fajita Bowl.png" },
    { dbTitle: "Chicken parmesan light Banza", filename: "Chicken Parmesan Light.png" },
    { dbTitle: "Chicken pesto pasta Banza", filename: "Chicken Pesto Pasta.png" },
    { dbTitle: "Chilli Mac", filename: "Chili Mac.png" }, // Spelling diff
    { dbTitle: "Greek chicken bowl", filename: "Greek Chicken Bowl.png" },
    { dbTitle: "Grilled chicken rice bowl", filename: "Grilled Chicken Rice Bowl.png" },
    { dbTitle: "Lemon herb chicken", filename: "Lemon Herb Chicken.png" },
    { dbTitle: "Mississippi Pot Roast", filename: "Mississippi Pot Roast.png" },
    { dbTitle: "Turkey bolognese Banza", filename: "Turkey Bolognese.png" },
    { dbTitle: "Turkey breakfast scramble", filename: "Turkey Breakfast Scramble.png" },
    { dbTitle: "Turkey chili cup", filename: "Turkey Chili Cup.png" },
    { dbTitle: "Turkey meatballs marinara Banza", filename: "Turkey Meatballs Marinara.png" },
    { dbTitle: "Turkey primavera Banza", filename: "Turkey Primavera.png" },
    { dbTitle: "Turkey shepherd pie", filename: "Turkey Shepherd’s Pie.png" },
    { dbTitle: "Turkey taco bowl", filename: "Turkey Taco Bowl.png" },
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
    console.log('Starting photo migration...');

    for (const mapping of MAPPINGS) {
        const sourcePath = path.join(SOURCE_DIR, mapping.filename);

        if (!fs.existsSync(sourcePath)) {
            console.warn(`Warning: Source file not found for "${mapping.dbTitle}": ${sourcePath}`);
            continue;
        }

        // Generate clean filename
        const cleanName = slugify(mapping.filename.replace('.png', '')) + '.png';
        const destPath = path.join(DEST_DIR, cleanName);
        const publicPath = `/meals/${cleanName}`;

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied "${mapping.filename}" to "${cleanName}"`);

        // Update Database
        const result = await prisma.meal.updateMany({
            where: { title: mapping.dbTitle },
            data: { image: publicPath }
        });

        if (result.count > 0) {
            console.log(`Updated DB for "${mapping.dbTitle}" -> ${publicPath}`);
        } else {
            console.error(`Error: Could not find meal in DB with title "${mapping.dbTitle}"`);
        }
    }

    console.log('Migration complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
