import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = createApp();

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

function logEnvHealth() {
  if (!jwtSecret) console.warn('JWT_SECRET is NOT set. Auth routes will fail.');
  else console.log('JWT_SECRET is set');

  if (!mongoUri) console.warn('MONGODB_URI is NOT set. Register/login will fail.');
  else console.log('MONGODB_URI is set');
}

async function start() {
  logEnvHealth();
  let dbConnected = false;

  if (!mongoUri) {
    console.warn('MONGODB_URI is required, but not provided. Starting API without DB.');
  } else {
    try {
      await connectDB(mongoUri);
      console.log('MongoDB connected');
      dbConnected = true;
    } catch (err) {
      console.error('MongoDB connection failed. Starting API without DB:', err?.message || err);
    }
  }

  // Expose DB status for routes/middleware to fail gracefully
  app.locals.dbConnected = dbConnected;

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`api listening on http://localhost:${port}`);
  });
}


start().catch((err) => {
  console.error('Failed to start API:', err);
  // Avoid crashing the server during local dev if DB is unavailable.
});

