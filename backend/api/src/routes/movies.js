import express from 'express';

import { tmdbGetMovieDetails, tmdbGetTrending, tmdbSearchMovies, tmdbGetMovieVideos, pickYoutubeTrailer } from '../services/tmdbClient.js';
import { Movie } from '../models/Movie.js';

const router = express.Router();

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';
function posterUrl(path, size = 'w300') {
  if (!path) return '';
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

function mapTmdbMovieToCard(m) {
  return {
    tmdbId: String(m.id),
    id: String(m.id),
    title: m.title || m.name || '',
    year: m.release_date ? Number(String(m.release_date).slice(0, 4)) : undefined,
    posterUrl: posterUrl(m.poster_path, 'w300'),
    backdropUrl: posterUrl(m.backdrop_path, 'w780'),
    genres: (m.genre_ids || []).join(',') || '',
    rating: typeof m.vote_average === 'number' ? m.vote_average : 0,
  };
}

function mapTmdbMovieToDetails(m, { trailerEmbedUrl } = {}) {
  return {
    tmdbId: String(m.id),
    id: String(m.id),
    title: m.title || m.name || '',
    tagline: m.tagline || '',
    description: m.overview || '',
    posterUrl: posterUrl(m.poster_path, 'w500'),
    backdropUrl: posterUrl(m.backdrop_path, 'w780'),
    trailerUrl: trailerEmbedUrl || '',
    releaseDate: m.release_date || '',
    runtimeMinutes: m.runtime,
    rating: m.vote_average || 0,
    genres: Array.isArray(m.genres) ? m.genres.map((g) => g.name).join(', ') : '',
    cast: (m.credits?.cast || []).slice(0, 12).map((c) => c.name).filter(Boolean),
    director: (m.credits?.crew || []).find((c) => c.job === 'Director')?.name || '',
    similarMovies: [],
    // similar movies will be populated separately
  };
}

function tmdbErrorResponse(res, err) {
  const code = err?.code || 'TMDB_ERROR';
  const status = code === 'TMDB_NOT_CONFIGURED' ? 503 : 503;
  return res.status(status).json({ message: 'TMDB unavailable', code });
}

// Trending (MVP)
router.get('/trending', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const data = await tmdbGetTrending({ page });
    const movies = (data.results || []).slice(0, 20).map(mapTmdbMovieToCard);
    return res.json({ movies });
  } catch (err) {
    return tmdbErrorResponse(res, err);
  }
});

// Search + listing
router.get('/', async (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q) : '';
    const page = Number(req.query.page || 1);

    if (!q) {
      // If no query, return trending-like results
      const data = await tmdbGetTrending({ page });
      const movies = (data.results || []).slice(0, 20).map(mapTmdbMovieToCard);
      return res.json({ movies });
    }

    const data = await tmdbSearchMovies({ query: q, page });
    const movies = (data.results || []).slice(0, 20).map(mapTmdbMovieToCard);
    return res.json({ movies });
  } catch (err) {
    return tmdbErrorResponse(res, err);
  }
});

// Movie details
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const dbConnected = Boolean(req.app?.locals?.dbConnected);

    // First try cache (only if MongoDB is available)
    if (dbConnected) {
      const cached = await Movie.findOne({ tmdbId: String(id) });
      if (cached) {
        return res.json({ movie: cached });
      }
    }

    const details = await tmdbGetMovieDetails(id);

    const videos = await tmdbGetMovieVideos(id);
    const trailerEmbedUrl = pickYoutubeTrailer(videos);

    // Save to cache (metadata only; streaming handled by dummy/demo)
    const movie = mapTmdbMovieToDetails(details, { trailerEmbedUrl });

    const similar = (details.similar?.results || []).slice(0, 12).map(mapTmdbMovieToCard);
    movie.similarMovies = similar;

    if (dbConnected) {
      await Movie.updateOne(
        { tmdbId: String(id) },
        {
          tmdbId: String(id),
          title: movie.title,
          description: movie.description,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          trailerUrl: movie.trailerUrl,
          videoUrl: '',
          genre: movie.genres,
          releaseDate: movie.releaseDate,
          runtimeMinutes: movie.runtimeMinutes,
          rating: movie.rating,
          cast: Array.isArray(movie.cast) ? movie.cast : [],
          director: movie.director,
        },
        { upsert: true }
      );
    }

    return res.json({ movie });
  } catch (err) {
    return tmdbErrorResponse(res, err);
  }
});


export default router;



