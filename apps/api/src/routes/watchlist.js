import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// Add movie to watchlist
router.post(
  '/add',
  requireAuth,
  [body('movieId').isString().notEmpty()],
  async (req, res) => {
    const { movieId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ watchlist: user.watchlist });
  }
);

// Remove movie from watchlist
router.delete('/remove/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.watchlist = (user.watchlist || []).filter((id) => id !== movieId);
  await user.save();

  res.json({ watchlist: user.watchlist });
});

// Get watchlist
router.get('/', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('watchlist');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ watchlist: user.watchlist || [] });
});

export default router;

