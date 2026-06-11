import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDB } from '../middleware/requireDB.js';

// Ensures Express response helpers exist even if middlewares accidentally mutate `res`
function safeStatus(res) {
    return typeof res.status === 'function' ? res.status.bind(res) : null;
}



const router = express.Router();

function sendValidationErrors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (typeof res.status === 'function') {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }
        // Fallback: avoid crashing if `res` was mutated
        res.json({ message: 'Validation failed', errors: errors.array() });
        return;
    }
    return null;
}


router.post(
    '/register', requireDB, [

        body('username').isLength({ min: 2, max: 32 }).withMessage('username must be 2-32 chars'),
        body('email').isEmail().withMessage('email must be valid'),
        body('password').isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
    ],
    async(req, res) => {
        const validationErr = sendValidationErrors(req, res);
        if (validationErr) return;

        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            passwordHash,
            watchlist: [],
        });

        const token = jwt.sign({ email: user.email, role: user.role },
            process.env.JWT_SECRET, { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    }
);


router.post(
    '/login', requireDB, [

        body('email').isEmail().withMessage('email must be valid'),
        body('password').isString().notEmpty().withMessage('password is required'),
    ],
    async(req, res) => {
        const validationErr = sendValidationErrors(req, res);
        if (validationErr) return;

        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ email: user.email, role: user.role },
            process.env.JWT_SECRET, { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );


        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }
);

router.get('/profile', requireAuth, requireDB, async(req, res) => {

    const user = await User.findById(req.user.id).select('username email watchlist role');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, watchlist: user.watchlist || [] } });

});

export default router;