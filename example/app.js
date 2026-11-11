const express = require('express');
const db = require('./config/database');
const createUsersRouter = require('./routes/users');

function createApp({ apiToken = process.env.API_TOKEN } = {}) {
  if (!apiToken) {
    throw new Error('Set API_TOKEN in .env before starting the API.');
  }

  const app = express();
  app.use(express.json());
  app.use('/api/users', createUsersRouter({ db, apiToken }));

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) {
      return next(error);
    }

    return res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
}

module.exports = { createApp, db };
