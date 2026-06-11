require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database Info:');
    console.log('Database name:', db.databaseName);
    console.log('Collections:', collections.map(c => c.name));
    
    // Check users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('📝 Number of users in database:', userCount);
    
    if (userCount > 0) {
      const users = await usersCollection.find().limit(5).toArray();
      console.log('\n👥 Users in database:');
      users.forEach(user => {
        console.log(`   - Email: ${user.email}`);
        console.log(`     Role: ${user.role || 'not set'}`);
        console.log(`     User ID: ${user._id}`);
      });
    } else {
      console.log('\n⚠️ No users found in database!');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();