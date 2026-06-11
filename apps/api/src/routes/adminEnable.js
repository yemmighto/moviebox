import express from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

function requireAdminSeedSecret(req, res, next) {
  const provided = req.get('x-admin-seed-secret') || req.query?.secret || req.body?.secret;
  const expected = process.env.ADMIN_SEED_SECRET;

  if (!expected) {
    return res.status(500).json({ message: 'ADMIN_SEED_SECRET not configured on server' });
  }

  if (!provided || provided !== expected) {
    return res.status(403).json({ message: 'Admin seed secret invalid' });
  }

  next();
}

// Enable admin for a given user email.
// Safe + protected by ADMIN_SEED_SECRET (passed via x-admin-seed-secret header).
router.post(
  '/enable-admin',
  requireAuth,
  requireAdminSeedSecret,
  [
    body('email').isEmail().withMessage('email must be valid'),
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ ok: true, user: { id: user._id, email: user.email, role: user.role } });
  }
);

export default router;

