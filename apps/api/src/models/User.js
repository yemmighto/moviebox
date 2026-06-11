import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 32, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    watchlist: [{ type: String }],
}, { timestamps: true });


export const User = mongoose.model('User', userSchema);