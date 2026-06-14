import { http } from './http';

export async function adminSeedMovies({ movies }) {
  const res = await http.post('/api/admin/seed', { movies });
  return res.data;
}

export async function adminListMovies() {
  const res = await http.get('/api/admin/movies');
  return res.data;
}

export async function adminUpsertMovie(movie) {
  const res = await http.post('/api/admin/movies', movie);
  return res.data;
}

export async function adminDeleteMovie(tmdbId) {
  const res = await http.delete(`/api/admin/movies/${encodeURIComponent(tmdbId)}`);
  return res.data;
}

