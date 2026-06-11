const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'apps/api/.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Hash the password using bcryptjs
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Update the user: add passwordHash field and keep role as admin
    const result = await usersCollection.updateOne(
      { email: 'admin1@example.com' },
      { 
        $set: { 
          passwordHash: passwordHash,  // This is what your app expects
          role: 'admin',
          email: 'admin1@example.com'  // Ensure email is lowercase
        },
        $unset: { password: "" }  // Remove the old password field
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin user fixed!');
      console.log('   Email: admin1@example.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      console.log('   Now using passwordHash field (what your app expects)');
    } else if (result.matchedCount === 0) {
      console.log('❌ User not found');
    } else {
      console.log('User already has correct structure');
    }
    
    // Verify the update
    const updatedUser = await usersCollection.findOne({ email: 'admin1@example.com' });
    console.log('\n📋 Updated user fields:');
    console.log('   - Has passwordHash?', !!updatedUser?.passwordHash);
    console.log('   - Has password?', !!updatedUser?.password);
    console.log('   - Role:', updatedUser?.role);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixAdminUser();