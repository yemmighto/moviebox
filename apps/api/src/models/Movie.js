import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    backdropUrl: { type: String, default: '' },
    trailerUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    genre: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    runtimeMinutes: { type: Number },
    rating: { type: Number, default: 0 },
    cast: [{ type: String }],
    director: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Movie = mongoose.model('Movie', movieSchema);

