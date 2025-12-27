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

async function main() {
    console.log('🚀 Uploading lemon herb chicken image to Supabase...');

    // Path to the image
    const imagePath = path.resolve(__dirname, '../public/meals/lemon-herb-chicken.png');

    if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image not found: ${imagePath}`);
        process.exit(1);
    }

    // Read the file
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = 'lemon-herb-chicken.png';

    console.log(`📤 Uploading ${fileName} to Supabase Storage...`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('meals')
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (uploadError) {
        console.error(`❌ Upload failed: ${uploadError.message}`);
        process.exit(1);
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('meals')
        .getPublicUrl(fileName);

    console.log(`✅ Uploaded successfully!`);
    console.log(`📍 Public URL: ${publicUrl}`);

    // Find the meal in the database
    const meal = await prisma.meal.findFirst({
        where: {
            title: {
                equals: 'Lemon herb chicken',
                mode: 'insensitive'
            }
        }
    });

    if (!meal) {
        console.error('❌ Meal "Lemon herb chicken" not found in database');
        process.exit(1);
    }

    console.log(`📝 Found meal: ${meal.title} (ID: ${meal.id})`);
    console.log(`   Current image: ${meal.image}`);

    // Update the database
    await prisma.meal.update({
        where: { id: meal.id },
        data: { image: publicUrl }
    });

    console.log(`✨ Database updated!`);
    console.log(`   New image URL: ${publicUrl}`);
    console.log('🎉 Done!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
