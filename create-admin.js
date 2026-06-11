const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Change this line

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Set a known password for admin1@example.com
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const result = await usersCollection.updateOne(
      { email: 'admin1@example.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin'
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Updated admin1@example.com password to: admin123');
      console.log('   Role is now: admin');
    } else {
      console.log('User not found or already updated');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdmin();