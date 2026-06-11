import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { getWatchlist } from '../api/watchlist.js';

export default function ProfilePage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!user?.id) return;
      try {
        const data = await getWatchlist();
        if (mounted) setWatchlist(data.watchlist || []);
      } catch {
        // keep UI stable
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [user?.id]);


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="mt-4 card bg-base-100">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full bg-primary/20 text-primary font-bold">{user?.username?.slice(0, 1)?.toUpperCase()}</div>
            </div>
            <div>
              <div className="font-semibold text-lg">{user?.username}</div>
              <div className="text-sm opacity-70">{user?.email}</div>
            </div>
          </div>

          <div className="divider" />
          <div>
            <div className="font-semibold">Watchlist</div>
            <div className="text-sm opacity-70">
              {user?.watchlist?.length ? `${user.watchlist.length} items saved` : 'No saved movies yet.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

