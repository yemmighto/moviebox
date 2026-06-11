import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlist.js';
import { getMovieById } from '../api/movies.js';
import MovieRow from '../components/MovieRow.jsx';

export default function WatchlistPage() {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      try {
        const data = await getWatchlist();
        if (!mounted) return;
        setIds(data.watchlist || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (user?.id) run();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!ids?.length) {
        setMovies([]);
        return;
      }
      const list = await Promise.all(ids.map((id) => getMovieById(id).then((d) => d.movie || d)));
      if (mounted) setMovies(list.filter(Boolean));
    }

    run();
    return () => {
      mounted = false;
    };
  }, [ids]);

  const onRemove = async (movieId) => {
    // Optimistic UI
    setIds((prev) => prev.filter((id) => id !== movieId));
    try {
      await removeFromWatchlist(movieId);
    } catch (e) {
      // Revert on failure
      setIds((prev) => (prev.includes(movieId) ? prev : [...prev, movieId]));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Watchlist</h1>

      {loading ? <div className="mt-4">Loading...</div> : null}

      {!loading && (!ids || ids.length === 0) ? (
        <div className="mt-8 opacity-70">No saved movies yet.</div>
      ) : null}

      {!loading && movies && movies.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((m) => (
            <div key={m.id} className="card bg-base-100 shadow-sm overflow-hidden">
              <figure className="h-44 bg-base-200">
                <img
                  src={m.posterUrl || m.poster || m.poster_path}
                  alt={m.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </figure>
              <div className="card-body p-3">
                <div className="font-semibold text-sm line-clamp-1">{m.title}</div>
                {m.year ? <div className="text-xs opacity-70">{m.year}</div> : null}
                <div className="card-actions justify-end mt-2">
                  <Link to={`/movies/${m.id}`} className="btn btn-ghost btn-xs">Details</Link>
                  <button className="btn btn-error btn-xs" onClick={() => onRemove(m.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

