import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../api/movies.js';
import MovieRow from '../components/MovieRow.jsx';
import { useAuth } from '../auth/AuthContext.jsx';


function Stars({ value }) {
  const v = Number(value || 0);
  const full = Math.floor(v);
  return (
    <div className="flex items-center gap-2">
      <div className="rating rating-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <input
            key={i}
            type="radio"
            name="rating-3"
            className="mask mask-star-2 bg-orange-400"
            checked={i < full}
            readOnly
          />
        ))}
      </div>
      <span className="text-sm opacity-70">{v.toFixed(1)}</span>
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        if (!mounted) return;
        setMovie(data?.movie || data || null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  const similar = useMemo(() => {
    if (!movie) return [];
    if (Array.isArray(movie.similarMovies) && movie.similarMovies.length) {
      return movie.similarMovies;
    }
    return [];
  }, [movie]);


  if (loading) return <div className="p-6">Loading...</div>;
  if (!movie)
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Movie not found.</span>
        </div>
        <div className="mt-4">
          <Link to="/search" className="btn">Back to Search</Link>
        </div>
      </div>
    );

  const title = movie.title || movie.name || 'Untitled';
  const year = movie.year || (movie.releaseDate ? movie.releaseDate.slice(0, 4) : undefined);
  const poster = movie.posterUrl || movie.poster || movie.poster_path;
  const backdrop = movie.backdropUrl || movie.backdrop || movie.backdrop_path;
  const trailerUrl = movie.trailerUrl || '';
  const description = movie.description || '';
  const tagline = movie.tagline || '';
  const genres = movie.genres || '';
  const cast = Array.isArray(movie.cast) ? movie.cast : [];
  const director = movie.director || '';
  const rating = movie.rating || 0;




  return (

    <div>
      <div className="relative">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {poster ? (
              <div className="w-44 sm:w-56">
                <img src={poster} alt={title} className="w-full h-auto rounded-lg shadow" />
              </div>
            ) : null}

            <div className="flex-1">

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{title}</h1>
                {year ? <span className="badge badge-neutral">{year}</span> : null}
                {rating ? <span className="badge badge-outline">{Number(rating).toFixed(1)}/10</span> : null}
              </div>

              <div className="mt-3">
                <Stars value={rating} />
              </div>

              {tagline ? <p className="mt-2 opacity-70 italic">{tagline}</p> : null}

              {description ? (
                <p className="mt-4 opacity-80 max-w-2xl">{description}</p>
              ) : (
                <p className="mt-4 opacity-80 max-w-2xl">
                  No synopsis available.
                </p>
              )}

              {genres ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.split(',').filter(Boolean).slice(0, 6).map((g) => (
                    <span key={g} className="badge badge-secondary badge-sm">{g}</span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex gap-2">
                <Link to={`/watch/${movie.id}`} className="btn btn-primary">Watch</Link>
                <Link to="/watchlist" className="btn">View Watchlist</Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="px-6 pb-10">
        <h2 className="text-2xl font-bold mt-8">Trailer</h2>
        <div className="mt-4 card bg-base-100">
          <div className="card-body">
            {trailerUrl ? (
              <div className="mt-3 aspect-video">
                <iframe
                  title="Trailer"
                  className="w-full h-full rounded-lg"
                  src={trailerUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-sm opacity-70">
                Trailer not available for this movie.
              </div>
            )}
          </div>
        </div>


        <h2 className="text-2xl font-bold mt-8">Cast</h2>
        {cast.length ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {cast.map((n) => (
              <div key={n} className="badge badge-outline">{n}</div>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm opacity-70">Cast not available.</div>
        )}

        <MovieRow title="Similar Movies" subtitle="Recommended" movies={similar} />

      </div>
    </div>
  );
}

