// test-env.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Looking for .env at:', path.join(__dirname, '../../.env'));
console.log('\nEnvironment Variables:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  // Only show part of the URL for security
  const maskedUrl = process.env.DATABASE_URL.replace(/(:|@)[^:@]*(?=[:|@])/g, '$1****');
  console.log('DATABASE_URL value:', maskedUrl);
}

// Test file system access to .env
const fs = require('fs');
try {
  const envPath = path.join(__dirname, '../../.env');
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log('\nEnv file exists and contains:', envContents.length, 'characters');
  console.log('First line preview:', envContents.split('\n')[0].substring(0, 20) + '...');
} catch (error) {
  console.error('\nError reading .env file:', error.message);
}