const { SquareClient, SquareEnvironment } = require('square');
const fs = require('fs');
const path = require('path');

// Load environment variables manually since we're running with tsx
function loadEnvFile(filename: string) {
    try {
        const envPath = path.resolve(process.cwd(), filename);
        if (fs.existsSync(envPath)) {
            // We need dotenv to parse
            try {
                const dotenv = require('dotenv');
                const envConfig = dotenv.parse(fs.readFileSync(envPath));
                for (const k in envConfig) {
                    process.env[k] = envConfig[k];
                }
                console.log(`✅ Loaded ${filename}`);
            } catch (err: any) {
                // If dotenv is missing, simple manual parse (fallback)
                console.log(`⚠️ dotenv package missing, using raw parse for ${filename}`);
                const content = fs.readFileSync(envPath, 'utf-8');
                content.split('\n').forEach((line: string) => {
                    const match = line.match(/^([^=]+)=(.*)$/);
                    if (match) {
                        const key = match[1].trim();
                        // Strip comments and whitespace
                        let val = match[2].trim();
                        const commentIndex = val.indexOf('#');
                        if (commentIndex !== -1) {
                            val = val.substring(0, commentIndex).trim();
                        }
                        // Remove quotes
                        val = val.replace(/^['"](.*)['"]$/, '$1');

                        if (key && !key.startsWith('#')) {
                            process.env[key] = val;
                        }
                    }
                });
                console.log(`✅ Loaded ${filename} (manual parse)`);
            }
        } else {
            console.log(`ℹ️  ${filename} not found`);
        }
    } catch (e: any) {
        console.log(`⚠️ Could not load ${filename}:`, e.message);
    }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

// console.log('Square SDK exports:', Object.keys(require('square')));
console.log('SquareEnvironment:', require('square').SquareEnvironment);

async function checkSquare() {
    console.log('\nChecking Environment Variables...');
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const env = process.env.SQUARE_ENV || 'sandbox'; // Default to sandbox if not specified

    const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET;

    console.log('SQUARE_ACCESS_TOKEN:', token ? '✅ Present' : '❌ Missing');
    console.log('SQUARE_LOCATION_ID:', locationId ? '✅ Present' : '❌ Missing');
    console.log('SQUARE_WEBHOOK_SECRET:', webhookSecret ? '✅ Present' : '❌ Missing (Required for order status updates)');
    console.log('SQUARE_ENV:', env);
    console.log('Token Prefix:', token ? token.substring(0, 4) + '...' : 'N/A');

    if (token && token.startsWith('EAAA') && env === 'production') {
        console.warn('⚠️  WARNING: Token starts with EAAA (Sandbox format) but environment is set to PRODUCTION.');
    }
    if (token && !token.startsWith('EAAA') && env === 'sandbox') {
        console.warn('⚠️  WARNING: Token does not start with EAAA (Sandbox format) but environment is set to SANDBOX.');
    }

    if (!token) {
        console.error('❌ Cannot proceed without Access Token');
        return;
    }

    console.log('\nInitializing Square Client...');
    try {
        const client = new SquareClient({
            accessToken: token,
            environment: env === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
        });

        console.log('Checking for Locations API Accessor...');
        if (client.locations) {
            console.log('✅ client.locations exists');
        } else if (client.locationsApi) {
            console.log('⚠️ client.locationsApi exists (Old SDK style?)');
        } else {
            console.log('❌ client.locations is MISSING');
            console.log('Client keys:', Object.keys(client));
        }

        console.log('\nVerifying Credentials (Listing Locations)...');
        try {
            const locationsApi = client.locations || client.locationsApi;
            if (!locationsApi) throw new Error('No Locations API accessor found');

            // Try list() (v40+) or listLocations() (v30-)
            const listFn = locationsApi.list ? locationsApi.list.bind(locationsApi) : locationsApi.listLocations.bind(locationsApi);
            if (!listFn) throw new Error(`Could not find list method on locations accessor. Keys: ${Object.keys(locationsApi)}`);

            const response = await listFn();
            console.log('✅ Connection Successful!');
            const locations = response.result.locations;
            console.log(`Found ${locations?.length || 0} locations:`);
            locations?.forEach((loc: any) => {
                console.log(` - ${loc.name} (${loc.id})`);
                if (loc.id === locationId) {
                    console.log('   MATCHES Configured Location ID! ✅');
                }
            });

            if (locationId && !locations?.find((l: any) => l.id === locationId)) {
                console.warn('⚠️ Configured Location ID not found in account locations!');
            }

        } catch (apiError: any) {
            // Square SDK v40+ might return BigInt which JSON.stringify hates, handle gracefully
            console.error('❌ API Call Failed:', apiError.message);
            if (apiError.errors) {
                console.error('API Errors:', apiError.errors.map((e: any) => e.detail || e.code));
            }
        }

        console.log('\n--- Raw Fetch Test ---');
        try {
            const baseUrl = env === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com';
            console.log(`Fetching ${baseUrl}/v2/locations...`);
            const res = await fetch(`${baseUrl}/v2/locations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Raw Status:', res.status, res.statusText);
            if (!res.ok) {
                const txt = await res.text();
                console.log('Raw Response:', txt);
            } else {
                console.log('✅ RAW FETCH SUCCESS! Credentials are valid.');
                console.log('   (If SDK failed, it is likely a local configuration/version issue, but the token works.)');
            }
        } catch (fetchErr: any) {
            console.error('❌ Raw Fetch Error:', fetchErr.message);
        }

    } catch (err: any) {
        console.error('❌ Client Initialization Error:', err.message);
    }
}

checkSquare();
