import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const poster = movie?.posterUrl || movie?.poster || movie?.poster_path;
  const title = movie?.title || movie?.name || 'Untitled';

  return (
    <Link
      to={movie?.id ? `/movies/${movie.id}` : '#'}
      className="card bg-base-100 shadow-sm hover:shadow transition-shadow overflow-hidden"
    >
      <figure className="h-40 bg-base-200">
        {poster ? (
          <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm opacity-60">No Image</div>
        )}
      </figure>
      <div className="card-body p-3">
        <div className="font-semibold text-sm line-clamp-1">{title}</div>
        {movie?.year ? <div className="text-xs opacity-70">{movie.year}</div> : null}
      </div>
    </Link>
  );
}

