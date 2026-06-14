import React from 'react';

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <div>
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        {subtitle ? <p className="text-sm opacity-70 mt-1">{subtitle}</p> : null}
      </div>
    </div>
  );
}

