import { http } from './http';

export async function getTrending() {
  const res = await http.get('/api/movies/trending');
  return res.data;
}

export async function searchMovies({ q, genre, year, rating, page } = {}) {
  const res = await http.get('/api/movies', {
    params: {
      q: q || undefined,
      genre: genre || undefined,
      year: year || undefined,
      rating: rating || undefined,
      page: page || undefined,
    },
  });
  return res.data;
}

export async function getMovieById(id) {
  const res = await http.get(`/api/movies/${id}`);
  return res.data;
}

