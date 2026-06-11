import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch role from DB so role changes apply immediately.
        const userId = payload.sub;
        return User.findById(userId)
            .select('email role')
            .lean()
            .then((dbUser) => {
                if (!dbUser) return res.status(401).json({ message: 'User not found' });
                req.user = { id: userId, email: payload.email || dbUser.email, role: dbUser.role || 'user' };
                next();
            })
            .catch(() => res.status(500).json({ message: 'Auth lookup failed' }));
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

