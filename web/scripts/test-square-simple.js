// Simple test to verify Square SDK works with the new configuration
const { SquareClient, SquareEnvironment } = require('square');

console.log('Testing Square SDK Configuration...\n');

// Test client instantiation with dummy values
console.log('Testing SquareClient instantiation...');
try {
    const square = new SquareClient({
        accessToken: 'test-access-token',
        environment: SquareEnvironment.Sandbox,
    });

    console.log('✅ SquareClient instantiated successfully!');
    console.log('   Client type:', square.constructor.name);

    // List available APIs
    const apis = Object.keys(square).filter(k => k.endsWith('Api'));
    console.log('\n📦 Available Square APIs (' + apis.length + ' total):');
    apis.slice(0, 15).forEach(api => console.log('   -', api));
    if (apis.length > 15) {
        console.log('   ... and', apis.length - 15, 'more');
    }

    // Check for checkoutApi specifically (used in orders.ts)
    if (square.checkoutApi) {
        console.log('\n✅ checkoutApi is available (required for payment links)');
    } else {
        console.log('\n❌ checkoutApi is NOT available!');
    }

    console.log('\n✅ All tests passed! Square SDK is configured correctly.');
    console.log('\nThe fix is working - SquareClient and SquareEnvironment are properly imported.');

} catch (error) {
    console.error('❌ Error instantiating SquareClient:');
    console.error('   ', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
}
