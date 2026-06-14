import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../api/movies.js';

export default function WatchPage() {
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

  if (loading) return <div className="p-6">Loading...</div>;

  if (!movie)
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Video not found.</span>
        </div>
        <div className="mt-4">
          <Link to="/" className="btn">Back Home</Link>
        </div>
      </div>
    );

    const title = movie.title || movie.name || 'Untitled';

  const videoSrc = movie?.videoUrl || '';
  const trailerSrc = movie?.trailerUrl || '';


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Watch</h1>
          <div className="opacity-70">{title}</div>
        </div>
        <Link to={`/movies/${movie.id}`} className="btn btn-ghost">Details</Link>
      </div>

      <div className="mt-6">
        <div className="aspect-video bg-base-200 rounded-lg overflow-hidden">
          {(() => {
            const videoUrl = videoSrc;
            const trailerUrl = trailerSrc;

            // Prefer a specific video URL if your backend provides one.
            if (videoUrl) {
              return (
                <video
                  className="w-full h-full"
                  controls
                  playsInline
                  preload="metadata"
                  src={videoUrl}
                />
              );
            }

            // Fallback to the movie's trailer embed URL (e.g., YouTube embed).
            if (trailerUrl) {
              return (
                <iframe
                  title="Trailer"
                  className="w-full h-full"
                  src={trailerUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            }

            // Final fallback placeholder.
            return (
              <iframe
                title="Demo Player"
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          })()}
        </div>
      </div>


      <div className="mt-6 card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Now Playing</h2>
          <p className="text-sm opacity-70">
            Demo video placeholder. Wire TMDB trailer/watch video and optionally a local/public-domain demo source.
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-sm">
              <div className="opacity-70">Title</div>
              <div className="font-semibold">{title}</div>
            </div>
            <div className="text-sm">
              <div className="opacity-70">Next Episode</div>
              <div className="font-semibold">N/A (demo)</div>
            </div>
          </div>

          <div className="card-actions justify-between flex-wrap">
            <Link to="/watchlist" className="btn btn-primary">View Watchlist</Link>
            {/* Episode UI placeholder for future TMDB series support */}
            <button className="btn btn-ghost" disabled>
              Next Episode
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Comments</h2>
        <p className="text-sm opacity-70 mt-1">
          Optional comments UI placeholder (wire to backend later).
        </p>

        <div className="mt-4 card bg-base-200">
          <div className="card-body">
            <div className="text-sm opacity-70">No comments yet.</div>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <input className="input input-bordered flex-1" placeholder="Add a comment..." disabled />
              <button className="btn btn-primary" disabled>Add Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

