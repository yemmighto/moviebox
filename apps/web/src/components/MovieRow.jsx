import React from 'react';
import MovieCard from './MovieCard.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function MovieRow({ title, subtitle, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="px-6">
        <SectionTitle title={title} subtitle={subtitle} />
      </div>
      <div className="px-6">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 [scrollbar-width:none]">
          {movies.map((m) => (
            <div key={m.id || m._id} className="min-w-[160px] max-w-[160px]">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

