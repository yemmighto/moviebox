import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrending, getMovieById } from '../api/movies.js';
import MovieRow from '../components/MovieRow.jsx';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const [heroMovie, setHeroMovie] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      try {
        const data = await getTrending();
        if (!mounted) return;

        const movies = data?.movies || data || [];
        setTrending(movies);

        // pick a random movie from the trending list for the hero
        const pick = movies.length ? movies[Math.floor(Math.random() * movies.length)] : null;
        setHeroMovie(pick);

        // fetch full details so the hero can show synopsis/runtime like the requested format
        if (pick?.id) {
          try {
            const details = await getMovieById(pick.id);
            const fullMovie = details?.movie || details;
            setHeroMovie(fullMovie || pick);
          } catch {
            // keep the card fields fallback
          }
        }
      } catch {
        if (!mounted) return;
        setTrending([]);
        setHeroMovie(null);
      } finally {
        if (mounted) setLoading(false);
        if (mounted) setHeroLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const heroTitle = heroMovie ? heroMovie.title || heroMovie.name : heroLoading ? 'Loading featured film...' : 'Discover your next favorite';
  const heroYear = heroMovie?.year;
  const heroGenre = heroMovie?.genres ? String(heroMovie.genres).split(',')[0]?.trim() : null;
  const heroRating = heroMovie?.rating !== undefined && heroMovie?.rating !== null ? Number(heroMovie.rating).toFixed(1) : null;
  const heroDescription = heroMovie?.description || heroMovie?.tagline || '';

  const heroRuntimeLabel = heroMovie?.runtimeMinutes
    ? `${Math.floor(Number(heroMovie.runtimeMinutes) / 60)}h ${Number(heroMovie.runtimeMinutes) % 60}min`
    : '—';

  return (
    <div className="p-6">
      <div className="hero bg-base-200 rounded-xl">
        <div className="hero-content flex-col lg:flex-row gap-6">
          <div className="max-w-3xl w-full">
            <div className="text-sm opacity-70">⭐ Featured Film</div>

            <div className="mt-3 flex flex-col md:flex-row gap-6 items-start">
              {heroMovie?.posterUrl ? (
                <img
                  src={heroMovie.posterUrl}
                  alt={heroMovie.title || heroMovie.name}
                  className="w-44 sm:w-56 rounded-lg shadow"
                />
              ) : null}

              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold">{heroTitle}</h2>

                {heroYear ? <div className="text-lg opacity-70 mt-1">{heroYear}</div> : null}

                <div className="mt-2 opacity-80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-ghost">{heroGenre || 'Genre'}</span>
                    <span className="opacity-70">·</span>
                    <span className="opacity-80">{heroRuntimeLabel}</span>
                    <span className="opacity-70">·</span>
                    <span className="badge badge-outline">⭐ {heroRating || '—'}</span>
                  </div>
                </div>

                {heroDescription ? (
                  <p className="mt-3 opacity-80 max-w-2xl">{heroDescription}</p>
                ) : (
                  <p className="mt-3 opacity-80 max-w-2xl">No synopsis available.</p>
                )}

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link to={`/watch/${heroMovie?.id}`} className="btn btn-primary">
                    ▶ Watch Now
                  </Link>
                  <Link to={heroMovie?.id ? `/movies/${heroMovie.id}` : '/search'} className="btn">
                    ℹ More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="px-6">Loading trending...</div>
        ) : (
          <>
            <MovieRow title="Trending Now" subtitle="Popular picks" movies={trending} />
            <MovieRow title="Top Rated" subtitle="Fan favorites" movies={trending.slice(0, 10)} />
            <MovieRow title="Action Movies" subtitle="High energy picks" movies={trending.slice(3, 15)} />
            <MovieRow title="Comedies" subtitle="Light & fun" movies={trending.slice(6, 18)} />
            <MovieRow title="Recently Added" subtitle="New uploads" movies={trending.slice(1, 13)} />
          </>
        )}
      </div>

      <footer className="mt-12 footer footer-center bg-base-200 text-base-content rounded-xl p-6">
        <div>
          <div className="font-bold text-lg">MovieBox</div>
          <div className="grid grid-flow-col gap-4 text-sm opacity-80 mt-2">
            <a className="link link-hover">About</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Privacy Policy</a>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <a className="btn btn-ghost btn-sm" aria-label="Twitter">𝕏</a>
            <a className="btn btn-ghost btn-sm" aria-label="YouTube">▶</a>
            <a className="btn btn-ghost btn-sm" aria-label="Instagram">⌁</a>
          </div>
          <div className="text-xs opacity-60 mt-3">© {new Date().getFullYear()} MovieBox.</div>
        </div>
      </footer>
    </div>
  );
}

