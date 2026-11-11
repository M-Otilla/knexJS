const path = require('path');

function createKnexConfig() {
  const client = process.env.DB_CLIENT || 'sqlite3';
  const config = {
    client,
    migrations: {
      directory: path.join(__dirname, '..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', 'database', 'seeds'),
    },
  };

  if (client === 'sqlite3') {
    const filename = process.env.DB_FILENAME || 'database/dev.sqlite';
    config.connection = {
      filename: filename === ':memory:'
        ? filename
        : path.resolve(__dirname, '..', filename),
    };
    config.useNullAsDefault = true;
    config.pool = {
      min: 1,
      max: 1,
      afterCreate(connection, done) {
        connection.run('PRAGMA foreign_keys = ON', (error) => done(error, connection));
      },
    };
  } else if (client === 'mysql2') {
    config.connection = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };
  } else {
    throw new Error(`Unsupported DB_CLIENT "${client}". Use sqlite3 or mysql2.`);
  }

  return config;
}

module.exports = createKnexConfig;
