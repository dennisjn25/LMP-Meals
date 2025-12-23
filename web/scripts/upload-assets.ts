
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_TO_UPLOAD = [
    { local: 'logo.png', remote: 'logo.png' },
    { local: 'justin_dowd_final.jpg', remote: 'justin_dowd_final.jpg' },
    { local: 'healthy-lifestyle.png', remote: 'healthy-lifestyle.png' },
    { local: 'prep-1.png', remote: 'prep-1.png' },
    { local: 'prep-2.png', remote: 'prep-2.png' },
    { local: 'prep-3.png', remote: 'prep-3.png' },
    { local: 'prep-4.png', remote: 'prep-4.png' },
    { local: 'prep-5.png', remote: 'prep-5.png' },
    { local: 'prep-6.png', remote: 'prep-6.png' },
];

const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function main() {
    console.log('🚀 Uploading site assets...');

    // Ensure 'assets' bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('assets');
    if (bucketError && bucketError.message.includes('not found')) {
        console.log("Creating 'assets' bucket...");
        await supabase.storage.createBucket('assets', { public: true });
    }

    const results: Record<string, string> = {};

    for (const asset of ASSETS_TO_UPLOAD) {
        const filePath = path.join(PUBLIC_DIR, asset.local);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  Skip: ${asset.local} not found in public/`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(asset.remote, fileBuffer, {
                contentType: asset.local.endsWith('.png') ? 'image/png' : 'image/jpeg',
                upsert: true
            });

        if (uploadError) {
            console.error(`❌ Failed to upload ${asset.local}:`, uploadError.message);
            continue;
        }

        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(asset.remote);
        console.log(`✅ Uploaded ${asset.local} -> ${publicUrl}`);
        results[asset.local] = publicUrl;
    }

    console.log('\nAsset URLs:');
    console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
