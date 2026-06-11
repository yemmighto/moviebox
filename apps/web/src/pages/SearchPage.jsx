import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMovies } from '../api/movies.js';
import MovieRow from '../components/MovieRow.jsx';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const q = query.get('q') || '';
  const genre = query.get('genre') || '';
  const year = query.get('year') || '';

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!q && !genre && !year) {
        setMovies([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchMovies({ q, genre, year });
        if (!mounted) return;
        setMovies(data?.movies || data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [q, genre, year]);

  const onSearch = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nextQ = formData.get('q')?.toString() || '';
    const nextGenre = formData.get('genre')?.toString() || '';
    const nextYear = formData.get('year')?.toString() || '';

    const params = new URLSearchParams();
    if (nextQ) params.set('q', nextQ);
    if (nextGenre) params.set('genre', nextGenre);
    if (nextYear) params.set('year', nextYear);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Search</h1>

      <form onSubmit={onSearch} className="mt-4 flex flex-col md:flex-row gap-3">
        <input
          name="q"
          defaultValue={q}
          className="input input-bordered flex-1"
          placeholder="Search movies..."
        />
        <input
          name="genre"
          defaultValue={genre}
          className="input input-bordered w-full md:w-48"
          placeholder="Genre"
        />
        <input
          name="year"
          defaultValue={year}
          className="input input-bordered w-full md:w-32"
          placeholder="Year"
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {loading ? <div className="mt-6">Loading...</div> : null}

      {!loading && movies && movies.length ? (
        <MovieRow title={`Results for “${q || 'movies'}”`} movies={movies} />
      ) : null}

      {!loading && (!movies || movies.length === 0) && (q || genre || year) ? (
        <div className="mt-6 opacity-70">No results found.</div>
      ) : null}
    </div>
  );
}

