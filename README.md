# Knex.js for Laravel Developers

A practical tutorial for Laravel developers learning to build an Express application with Knex. Knex is a SQL query builder, not an ORM replacement for Eloquent: you compose SQL explicitly and can add your own lightweight model layer.

## Tutorial chapters

| # | Chapter | Topics |
|---|---|---|
| 1 | [Introduction](Tutorial/01-introduction.md) | Prerequisites and the Knex mental model |
| 2 | [Project setup](Tutorial/02-setup.md) | Node.js, npm, dependencies, and local configuration |
| 3 | [Routes and controllers](Tutorial/03-routing-controls.md) | Express routes, middleware, and request handling |
| 4 | [Model layer](Tutorial/04-models.md) | Grouping reusable queries |
| 5 | [Database and migrations](Tutorial/05-database.md) | Knex configuration, schema changes, and sample data |
| 6 | [Query builder](Tutorial/06-queries.md) | CRUD, joins, and bound values |

## Example project

The [`example/`](example/) directory contains a runnable Express API for users and posts.

### Server setup

Follow the [example server setup guide](example/README.md) for installation, MySQL configuration, API requests, and testing.

For a quick local start with SQLite, open PowerShell in the repository root and run:

```powershell
Set-Location .\example
npm install
Copy-Item .env.example .env
```

Set a private `API_TOKEN` in `.env`, then run:

```powershell
npm run db:migrate
npx knex seed:run --specific=001_sample_users.js
npm start
```

The API listens at `http://localhost:3000`; user endpoints require the bearer token from `.env`. The sample seed clears and rebuilds the `users` and `posts` tables, so use it only with the local training database. The seed directory also contains an unfinished generated placeholder; run only the named seed above, not `db:seed` or `db:setup`.

## API examples

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List active users |
| `GET` | `/api/users/search?email=john%40example.test` | Find a user by email |
| `GET` | `/api/users/{{userId}}/posts` | Get a user and their posts |
| `POST` | `/api/users` | Create a user |
