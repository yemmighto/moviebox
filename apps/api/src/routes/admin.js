import express from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

import { Movie } from '../models/Movie.js';

const router = express.Router();

// Admin seed endpoint: creates/updates a list of movies.
// Intended for demo/portfolio use.
router.post(
  '/seed',
  requireAuth,
  requireAdmin,
  [
    body('movies').isArray().withMessage('movies must be an array'),
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors.array() });
    }

    const { movies } = req.body;


    // Simple create/update strategy based on tmdbId
    // If tmdbId is missing, we skip that record.
    let created = 0;
    let updated = 0;

    for (const m of movies) {
      if (!m || !m.tmdbId) continue;

      const existing = await Movie.findOne({ tmdbId: m.tmdbId });
      if (existing) {
        Object.assign(existing, m);
        await existing.save();
        updated += 1;
      } else {
        await Movie.create(m);
        created += 1;
      }
    }

    res.json({ ok: true, created, updated });
  }
);

// Admin upload movie
router.post(
  '/movies',
  requireAuth,
  requireAdmin,
  [body('tmdbId').isString().notEmpty().withMessage('tmdbId is required')],
  async (req, res) => {
    const { tmdbId, title, description, posterUrl, backdropUrl, trailerUrl, videoUrl, genre, releaseDate, runtimeMinutes, rating, cast, director } = req.body;

    const movie = await Movie.findOneAndUpdate(
      { tmdbId },
      {
        tmdbId,
        title,
        description: description || '',
        posterUrl: posterUrl || '',
        backdropUrl: backdropUrl || '',
        trailerUrl: trailerUrl || '',
        videoUrl: videoUrl || '',
        genre: genre || '',
        releaseDate: releaseDate || '',
        runtimeMinutes,
        rating: rating || 0,
        cast: Array.isArray(cast) ? cast : [],
        director: director || '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ ok: true, movie });
  }
);

// Admin list movies
router.get('/movies', requireAuth, requireAdmin, async (req, res) => {
  const movies = await Movie.find({}).sort({ createdAt: -1 }).limit(200);
  res.json({ movies });
});

// Admin delete movie
router.delete('/movies/:tmdbId', requireAuth, requireAdmin, async (req, res) => {
  const { tmdbId } = req.params;
  await Movie.deleteOne({ tmdbId });
  res.json({ ok: true });
});

export default router;

