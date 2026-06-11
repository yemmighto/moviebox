import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);
    return mongoose.connection;
}