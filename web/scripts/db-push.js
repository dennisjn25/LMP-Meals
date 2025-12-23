require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

// Auto-fix DIRECT_URL for Supabase
if (process.env.DATABASE_URL) {
    // If DIRECT_URL is missing, OR it's identical to DATABASE_URL, OR it uses port 6543
    if (!process.env.DIRECT_URL ||
        process.env.DIRECT_URL === process.env.DATABASE_URL ||
        process.env.DIRECT_URL.includes('6543')) {

        console.log('Forcing DIRECT_URL to use port 5432 for migrations...');
        process.env.DIRECT_URL = process.env.DATABASE_URL.replace('6543', '5432');

        // Also ensure DATABASE_URL is set for the child process
        process.env.DATABASE_URL = process.env.DATABASE_URL;
    }
}

console.log('Using DIRECT_URL:', process.env.DIRECT_URL);

console.log('Pushing schema to database...');
try {
    execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
    console.log('Schema push successful.');
} catch (error) {
    console.error('Schema push failed.');
    process.exit(1);
}
