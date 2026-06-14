import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import watchlistRoutes from './routes/watchlist.js';
import adminRoutes from './routes/admin.js';
import adminEnableRoutes from './routes/adminEnable.js';



dotenv.config();


export function createApp() {
    const app = express();

    app.use(helmet());

    // Dev-friendly CORS. Frontend runs on Vite (default http://localhost:5173)
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    app.use(
        cors({
            origin: corsOrigin,
            credentials: false,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );


    app.use(express.json());

    app.get('/api/health', (req, res) => {
        res.json({ ok: true, service: 'api' });
    });

    app.use('/api/auth', authRoutes);

    app.use('/api/movies', moviesRoutes);
    app.use('/api/watchlist', watchlistRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/admin', adminEnableRoutes);



    // basic error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res) => {
        console.error(err);
        const statusFn = typeof res?.status === 'function' ? res.status.bind(res) : null;
        const jsonFn = typeof res?.json === 'function' ? res.json.bind(res) : null;

        if (statusFn && jsonFn) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (jsonFn) {
            return res.json({ message: 'Internal server error' });
        }

        try {
            // eslint-disable-next-line no-underscore-dangle
            res.end?.();
        } catch {
            // ignore
        }
    });



    return app;
}