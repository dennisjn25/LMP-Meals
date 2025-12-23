// Test the actual square client from lib
const { square } = require('../src/lib/square');

console.log('✅ Square client loaded successfully!');
console.log('Square client type:', square.constructor.name);
console.log('\nAvailable API endpoints:');
const apis = Object.keys(square).filter(k => k.endsWith('Api'));
apis.forEach(api => console.log(`  - ${api}`));

console.log('\nTotal APIs available:', apis.length);
