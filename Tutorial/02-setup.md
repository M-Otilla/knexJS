# Project Setup

The tutorial uses the supplied [example project](../example/) so the commands, configuration, and code match the slide deck. It requires Node.js 20 or newer.

## Install dependencies

Open PowerShell in the `example` directory:

```powershell
Set-Location .\example
npm install
Copy-Item .env.example .env
```

Edit `.env` and set `API_TOKEN` to a private value. Keep `.env` out of source control; use `.env.example` to share variable names and safe defaults. Do not put a real token or password in a recording.

The example defaults to SQLite:

```dotenv
DB_CLIENT=sqlite3
DB_FILENAME=database/dev.sqlite
```

This local database does not require a separate database server. For MySQL, set `DB_CLIENT=mysql2` and provide `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_DATABASE` in `.env`. Create the database and application user separately before running migrations.

## Create the database

Apply the migrations to the configured local database:

```powershell
npm run db:migrate
```

To load the users-and-posts sample data, run only its seed file:

```powershell
npx knex seed:run --specific=001_sample_users.js
```

This seed clears and rebuilds the example `users` and `posts` tables. Use it only with the local training database, never a database containing data you need to keep. The seed folder also contains an unfinished generated sample file, so avoid `npm run db:seed` and `npm run db:setup` until all seeds have been reviewed.

## Run and check the API

Start the server:

```powershell
npm start
```

It listens at `http://localhost:3000`. User routes require the bearer token from `.env`. In PowerShell, set a request header without printing the token:

```powershell
$headers = @{ Authorization = "Bearer $env:API_TOKEN" }
Invoke-RestMethod http://localhost:3000/api/users -Headers $headers
```

Run the automated tests with:

```powershell
npm test
```

The tests use an in-memory SQLite database and do not need the development database to be seeded.

## What npm installed

| Package | Role |
|---|---|
| `express` | HTTP server and routing |
| `knex` | SQL query builder and migration/seed CLI |
| `dotenv` | Loads local environment settings |
| `sqlite3` | Default SQLite driver |
| `mysql2` | Optional MySQL driver |

`package.json` declares the dependencies and scripts; `package-lock.json` records the resolved dependency versions. The project does not need a separate `knex-cli` package.
