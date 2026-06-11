const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'apps/api/.env') });
const mongoose = require('mongoose');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email: 'admin1@example.com' });
    
    if (user) {
      console.log('\n📋 User found in database:');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password ? user.password.substring(0, 50) + '...' : 'No password field');
      console.log('Password field type:', typeof user.password);
      console.log('Has "password" field?', 'password' in user);
    } else {
      console.log('❌ User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUser();