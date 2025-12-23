
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try service role key first (for bypassing RLS), then anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(process.cwd(), 'public');
const BUCKET_NAME = 'assets';

const filesToUpload = [
    'high-protein.png',
    'keto-friendly.png',
    'balanced-nutrition.png'
];

async function uploadAssets() {
    console.log('🚀 Starting upload to Supabase...');

    for (const fileName of filesToUpload) {
        const filePath = path.join(ASSETS_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found locally: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const contentType = 'image/png'; // Assuming png based on extension

        try {
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(fileName, fileBuffer, {
                    contentType,
                    upsert: true // Overwrite if exists
                });

            if (error) {
                console.error(`❌ Failed to upload ${fileName}:`, error.message);
            } else {
                console.log(`✅ Uploaded ${fileName}`);

                // Get public URL
                const { data: { publicUrl } } = supabase
                    .storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(fileName);

                console.log(`   Public URL: ${publicUrl}`);
            }
        } catch (err) {
            console.error(`❌ Unexpected error for ${fileName}:`, err);
        }
    }
}

uploadAssets();
