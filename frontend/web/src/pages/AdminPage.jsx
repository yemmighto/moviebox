import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext.jsx';
import { adminListMovies, adminUpsertMovie, adminDeleteMovie } from '../api/admin.js';

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = (user && user.role) === 'admin';

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const [form, setForm] = useState({
    tmdbId: '',
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    videoUrl: '',
    genre: '',
    releaseDate: '',
    runtimeMinutes: '',
    rating: '',
    cast: [],
    director: '',
  });

  const castString = useMemo(() => {
    if (!Array.isArray(form.cast)) return '';
    return form.cast.join(', ');
  }, [form.cast]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = await adminListMovies();
        if (!mounted) return;
        setMovies(data.movies || []);
      } catch (e) {
        if (!mounted) return;
        toast.error('Failed to load admin movies');
        setMovies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.tmdbId.trim() || !form.title.trim()) {
        toast.error('tmdbId and title are required');
        return;
      }

      const payload = {
        ...form,
        runtimeMinutes: form.runtimeMinutes === '' ? undefined : Number(form.runtimeMinutes),
        rating: form.rating === '' ? undefined : Number(form.rating),
        cast: Array.isArray(form.cast) ? form.cast : [],
      };

      await adminUpsertMovie(payload);
      toast.success('Movie saved');

      const data = await adminListMovies();
      setMovies(data.movies || []);

      setForm({
        tmdbId: '',
        title: '',
        description: '',
        posterUrl: '',
        backdropUrl: '',
        trailerUrl: '',
        videoUrl: '',
        genre: '',
        releaseDate: '',
        runtimeMinutes: '',
        rating: '',
        cast: [],
        director: '',
      });
    } catch (e) {
      toast.error('Failed to save movie');
    }
  };

  const onDelete = async (tmdbId) => {
    try {
      await adminDeleteMovie(tmdbId);
      toast.success('Movie deleted');
      const data = await adminListMovies();
      setMovies(data.movies || []);
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 opacity-70">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-2 opacity-70">Manage movie catalog (demo upload/manage).</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Add / Update Movie</h2>

            <form onSubmit={onSubmit} className="grid gap-3">
              <div>
                <label className="label"><span className="label-text">tmdbId</span></label>
                <input className="input input-bordered w-full" value={form.tmdbId} onChange={(e) => setForm((p) => ({ ...p, tmdbId: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Title</span></label>
                <input className="input input-bordered w-full" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Description</span></label>
                <textarea className="textarea textarea-bordered w-full" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Poster URL</span></label>
                <input className="input input-bordered w-full" value={form.posterUrl} onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Backdrop URL</span></label>
                <input className="input input-bordered w-full" value={form.backdropUrl} onChange={(e) => setForm((p) => ({ ...p, backdropUrl: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Trailer URL (YouTube embed/watch)</span></label>
                <input className="input input-bordered w-full" value={form.trailerUrl} onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Video URL (demo/public domain)</span></label>
                <input className="input input-bordered w-full" value={form.videoUrl} onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Genre</span></label>
                <input className="input input-bordered w-full" value={form.genre} onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label"><span className="label-text">Release date</span></label>
                  <input className="input input-bordered w-full" value={form.releaseDate} onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label"><span className="label-text">Runtime (minutes)</span></label>
                  <input className="input input-bordered w-full" value={form.runtimeMinutes} onChange={(e) => setForm((p) => ({ ...p, runtimeMinutes: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label"><span className="label-text">Rating (number)</span></label>
                <input className="input input-bordered w-full" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} />
              </div>

              <div>
                <label className="label"><span className="label-text">Cast (comma-separated)</span></label>
                <input
                  className="input input-bordered w-full"
                  value={castString}
                  onChange={(e) => setForm((p) => ({ ...p, cast: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Director</span></label>
                <input className="input input-bordered w-full" value={form.director} onChange={(e) => setForm((p) => ({ ...p, director: e.target.value }))} />
              </div>

              <button type="submit" className="btn btn-primary">Save movie</button>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Movies ({movies.length})</h2>

            {loading ? (
              <div className="opacity-70">Loading...</div>
            ) : (
              <div className="overflow-auto max-h-[520px] pr-1">
                <div className="space-y-3">
                  {movies.map((m) => (
                    <div key={m.tmdbId || m._id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
                      <div>
                        <div className="font-semibold">{m.title || '(untitled)'}</div>
                        <div className="text-sm opacity-70">{m.tmdbId}</div>
                      </div>
                      <button className="btn btn-error btn-sm" onClick={() => onDelete(m.tmdbId)}>Delete</button>
                    </div>
                  ))}

                  {!movies.length ? <div className="opacity-70">No movies yet.</div> : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

