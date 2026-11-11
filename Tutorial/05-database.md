# Database Configuration and Migrations

The example shares one Knex configuration between the CLI and the application:

1. [`config/knex-config.js`](../example/config/knex-config.js) selects the driver, connection, migration directory, and seed directory.
2. [`knexfile.js`](../example/knexfile.js) loads `.env` and exposes the configuration to Knex's CLI.
3. [`config/database.js`](../example/config/database.js) creates the Knex instance used by the app.

By default, the example uses SQLite at `database/dev.sqlite`. Set `DB_CLIENT=mysql2` and the MySQL connection variables in `.env` to use MySQL instead. The example configuration is for local learning; review and separate environment settings before adapting it for production.

## Migrations

Migrations record schema changes in order. Each migration's `up` method applies a change and `down` describes how to undo it. The example's first migration creates `users` with a required name, unique email, default role and active status, and timestamps:

```js
exports.up = async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('role').notNullable().defaultTo('user');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('users');
};
```

The next migration creates `posts` with a foreign key to `users`. Its `ON DELETE CASCADE` rule removes a user's posts when that user is deleted. See the migrations in [`example/database/migrations/`](../example/database/migrations/).

From the `example` directory, use the included scripts:

```powershell
npm run db:migrate
npm run db:rollback
```

`db:rollback` rolls back the latest migration batch and can remove tables. Use it only when you understand the effect on the selected database.

## Sample data

The valid users-and-posts sample seed is [`001_sample_users.js`](../example/database/seeds/001_sample_users.js). It deletes posts before users to respect the foreign key, then inserts a user and a related post. It refuses to run when `NODE_ENV` is `production`.

Run just that seed against a local training database:

```powershell
npx knex seed:run --specific=001_sample_users.js
```

The seed clears and rebuilds the sample `users` and `posts` tables. Do not run it against production or any database with data you need to preserve. The seed directory also contains an unfinished generated placeholder, so the example's `db:seed` and `db:setup` scripts should not be used until that file is addressed.
