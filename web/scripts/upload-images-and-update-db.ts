
import { PrismaClient } from '../src/generated/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

const PHOTOS_DIR = path.resolve(__dirname, '../../LMP-Meals-Photos');

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
    console.log('🚀 Starting image upload and DB update...');

    if (!fs.existsSync(PHOTOS_DIR)) {
        console.error(`❌ Photos directory not found: ${PHOTOS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(PHOTOS_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
        const title = file.replace(/\.(png|jpg)$/, ''); // Title matches filename (usually)
        // But filenames in LMP-Meals-Photos are roughly titles.
        // e.g. "Beef Burrito Bowl.png" -> Title "Beef Burrito Bowl" (matches DB?)

        // Check if meal exists
        // We might need to match case-insensitive or fuzzy, but start with exact or simple variations
        // The previous script had a MAPPINGS array.
        // Let's rely on the file name being close to the title.

        // Find meal in DB
        // Try strict match first
        let meal = await prisma.meal.findFirst({
            where: { title: { equals: title, mode: 'insensitive' } }
        });

        // Special cases mapping if needed (from archived script)
        if (!meal) {
            if (file === "Beef amd Potato Hash.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Beef and potato hash" } });
            } else if (file === "Turkey Shepherd’s Pie.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Turkey shepherd pie" } });
            } else if (file === "Chicken Alfredo Light.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Chicken alfredo light Banza" } });
            } else if (file === "Chicken Parmesan Light.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Chicken parmesan light Banza" } });
            } else if (file === "Chicken Pesto Pasta.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Chicken pesto pasta Banza" } });
            } else if (file === "Turkey Bolognese.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Turkey bolognese Banza" } });
            } else if (file === "Turkey Meatballs Marinara.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Turkey meatballs marinara Banza" } });
            } else if (file === "Turkey Primavera.png") {
                meal = await prisma.meal.findFirst({ where: { title: "Turkey primavera Banza" } });
            }
        }

        if (!meal) {
            console.log(`⚠️  Skipping "${file}": No matching meal found in DB.`);
            continue;
        }

        console.log(`\nProcessing "${file}" for meal: "${meal.title}"`);

        // Upload to Supabase
        const filePath = path.join(PHOTOS_DIR, file);
        const fileBuffer = fs.readFileSync(filePath);
        const cleanName = slugify(title) + path.extname(file);

        console.log(`   Uploading as: ${cleanName}`);

        const { error: uploadError } = await supabase.storage
            .from('meals')
            .upload(cleanName, fileBuffer, {
                contentType: 'image/png', // assume png based on files
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            continue;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('meals')
            .getPublicUrl(cleanName);

        console.log(`   ✅ Uploaded: ${publicUrl}`);

        // Update DB
        await prisma.meal.update({
            where: { id: meal.id },
            data: { image: publicUrl }
        });
        console.log(`   ✨ DB Updated!`);
    }

    console.log('\n🎉 Done!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
