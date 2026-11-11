const { createApp } = require('./app');

const port = process.env.PORT || 3000;

createApp().listen(port, () => {
  console.log(`Knex example API listening on http://localhost:${port}`);
});
