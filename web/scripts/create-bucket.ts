
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Try to get service role if available
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clientKey = serviceRole || supabaseKey;

if (!supabaseUrl || !clientKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, clientKey);

async function main() {
    console.log(`Attempting to create 'meals' bucket using key starting with: ${clientKey.substring(0, 5)}...`);

    const { data, error } = await supabase.storage.createBucket('meals', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
        console.error('Error creating bucket:', error);
    } else {
        console.log('Success! Created bucket:', data);
    }
}

main();
