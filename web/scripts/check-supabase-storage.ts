
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Checking Supabase Storage...');

    // List buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error.message);
    } else {
        console.log('Buckets:', buckets.map(b => b.name));

        // Check content of 'meals' bucket if it exists
        if (buckets.find(b => b.name === 'meals')) {
            console.log("Checking 'meals' bucket content...");
            const { data: files, error: filesError } = await supabase.storage.from('meals').list();
            if (filesError) {
                console.error('Error listing files in meals:', filesError.message);
            } else {
                console.log(`Found ${files.length} files in 'meals' bucket.`);
                if (files.length > 0) console.log('Sample:', files[0].name);
            }
        }
    }
}

main();
