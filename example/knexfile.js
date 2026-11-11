require('dotenv').config();

const createKnexConfig = require('./config/knex-config');

const development = createKnexConfig();

module.exports = {
  development,
  test: development,
  production: development,
};
