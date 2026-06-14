export function requireDB(req, res, next) {
  // app.locals.dbConnected is set during server startup
  if (req.app?.locals?.dbConnected) return next();
  return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
}

