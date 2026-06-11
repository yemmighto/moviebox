import { http } from './http';

export async function getWatchlist() {
  const res = await http.get('/api/watchlist');
  return res.data;
}

export async function addToWatchlist(movieId) {
  const res = await http.post('/api/watchlist/add', { movieId });
  return res.data;
}

export async function removeFromWatchlist(movieId) {
  const res = await http.delete(`/api/watchlist/remove/${movieId}`);
  return res.data;
}

