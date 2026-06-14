// create-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure bcrypt is installed

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@moviebox.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Current role:', existingAdmin.role);
      
      // Update role to admin if needed
      if (existingAdmin.role !== 'admin') {
        await usersCollection.updateOne(
          { email: 'admin@moviebox.com' },
          { $set: { role: 'admin' } }
        );
        console.log('✅ Updated user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const newAdmin = {
        email: 'admin@moviebox.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        isAdmin: true
      };
      
      await usersCollection.insertOne(newAdmin);
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@moviebox.com');
      console.log('   Password: Admin123!');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdmin();