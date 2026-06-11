// check-env.js
require('dotenv').config();

console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT || '4000 (default)');

if (process.env.MONGODB_URI) {
  console.log('\nFirst few characters of URI:', process.env.MONGODB_URI.substring(0, 30) + '...');
} else {
  console.log('\n❌ MONGODB_URI not found in .env file');
  console.log('Make sure your .env file has: MONGODB_URI=your_connection_string');
}