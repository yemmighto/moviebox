import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getEnv(name) {
  return process.env[name] || '';
}

// TMDB API key for v3 requests is passed via query param `api_key`.
const apiKey = getEnv('TMDB_API_KEY');

function buildQueryAuthParams(extraParams = {}) {
  if (!apiKey) return extraParams;
  // Avoid object spread for older lint/node configs.
  const mergedParams = Object.assign({ api_key: apiKey }, extraParams);
  return mergedParams;
}


const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

function ensureConfigured() {
  if (!apiKey) {
    const err = new Error('TMDB not configured');
    err.code = 'TMDB_NOT_CONFIGURED';
    // Do not throw to avoid crashing the dev server.
    return false;
  }
  return true;
}

export async function tmdbGet(path, params = {}) {
  ensureConfigured();
  const res = await tmdb.get(path, { params: buildQueryAuthParams(params) });
  return res.data;
}

export async function tmdbSearchMovies({ query, page = 1, include_adult = false } = {}) {
  return tmdbGet('/search/movie', {
    query,
    page,
    include_adult,
  });
}

export async function tmdbGetTrending({ page = 1 } = {}) {
  // MVP: use daily trending as “Trending”.
  return tmdbGet('/trending/movie/day', { page });
}

export async function tmdbGetMovieDetails(movieId, { append_to_response = 'credits,reviews,similar' } = {}) {
  return tmdbGet(`/movie/${movieId}`, {
    append_to_response,
    language: 'en-US',
  });
}

export async function tmdbGetMovieVideos(movieId) {
  return tmdbGet(`/movie/${movieId}/videos`, { language: 'en-US' });
}

export function pickYoutubeTrailer(videosResponse) {
  const results = videosResponse?.results || [];
  const trailer =
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    results.find((v) => v.site === 'YouTube');

  if (!trailer) return null;
  return trailer.key ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

