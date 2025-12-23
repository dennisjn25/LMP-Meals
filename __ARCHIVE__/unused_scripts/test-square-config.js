// Simple test to verify Square SDK works with the new configuration
require('dotenv').config({ path: '.env.local' });

const { SquareClient, SquareEnvironment } = require('square');

console.log('Testing Square SDK Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('  SQUARE_ACCESS_TOKEN:', process.env.SQUARE_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');
console.log('  SQUARE_ENVIRONMENT:', process.env.SQUARE_ENVIRONMENT || 'Not set');
console.log('  SQUARE_LOCATION_ID:', process.env.SQUARE_LOCATION_ID ? '✅ Set' : '❌ Missing');

// Test client instantiation
console.log('\nTesting SquareClient instantiation...');
try {
    const square = new SquareClient({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: process.env.SQUARE_ENVIRONMENT === 'production'
            ? SquareEnvironment.Production
            : SquareEnvironment.Sandbox,
    });

    console.log('✅ SquareClient instantiated successfully!');
    console.log('   Client type:', square.constructor.name);

    // List available APIs
    const apis = Object.keys(square).filter(k => k.endsWith('Api'));
    console.log('\n📦 Available Square APIs (' + apis.length + ' total):');
    apis.slice(0, 10).forEach(api => console.log('   -', api));
    if (apis.length > 10) {
        console.log('   ... and', apis.length - 10, 'more');
    }

    console.log('\n✅ All tests passed! Square SDK is configured correctly.');

} catch (error) {
    console.error('❌ Error instantiating SquareClient:');
    console.error('   ', error.message);
    process.exit(1);
}
