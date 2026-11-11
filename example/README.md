# Knex for Laravel Developers — Example

A small Express API for following the training deck. It keeps familiar routes, middleware, controllers, and a query model, while showing how Knex composes SQL.

## Requirements

- Node.js 20 or newer
- npm (included with Node.js)
- XAMPP with MySQL

## Install and configure

From the project directory, install the dependencies and create your local environment file:

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and set `API_TOKEN` to a private value.

## Set up MySQL with XAMPP

1. Open the XAMPP Control Panel and start **MySQL**. Start **Apache** as well if you plan to use phpMyAdmin.
2. Open `http://localhost/phpmyadmin`, select the **SQL** tab, and create a database and an application user. Replace the example password with your own:

   ```sql
   CREATE DATABASE knex_tutorial
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   CREATE USER 'knex_user'@'127.0.0.1' IDENTIFIED BY 'change_this_password';
   GRANT ALL PRIVILEGES ON knex_tutorial.* TO 'knex_user'@'127.0.0.1';
   ```

3. Edit `.env` to use the database and credentials you created:

   ```dotenv
   DB_CLIENT=mysql2
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=knex_user
   DB_PASSWORD=change_this_password
   DB_DATABASE=knex_tutorial
   ```

   Keep your `API_TOKEN` setting. If MySQL in XAMPP uses a different port, set `DB_PORT` to that port. The `DB_CLIENT=mysql2` setting is required to use MySQL.
4. From the project directory, create the tables and start the API:

   ```powershell
   npm run db:migrate
   npm start
   ```

The API listens at `http://localhost:3000`. To restart it automatically when files change, use `npm run dev` instead of `npm start`.

## Test the API

Use Postman to send requests to the running API at `http://localhost:3000`. For each request, open the **Authorization** tab, choose **Bearer Token**, and enter the value of `API_TOKEN` from `.env`.

Create a user first so you have an ID to use in the other requests:

| Method | URL | Request body | Purpose |
| --- | --- | --- | --- |
| `POST` | `http://localhost:3000/api/users` | Select **Body → raw → JSON** and enter `{"name":"John Doe","email":"john@example.test"}` | Create a user; copy the returned `data.id` |
| `GET` | `http://localhost:3000/api/users` | — | List users |
| `GET` | `http://localhost:3000/api/users/search?email=john@example.test` | — | Find a user by email |
| `GET` | `http://localhost:3000/api/users/{{userId}}` | — | Get one user |
| `GET` | `http://localhost:3000/api/users/{{userId}}/posts` | — | Get a user and their posts |
| `PATCH` | `http://localhost:3000/api/users/{{userId}}` | Select **Body → raw → JSON** and enter `{"name":"John Smith"}` | Update a user's name or email |
| `DELETE` | `http://localhost:3000/api/users/{{userId}}` | — | Delete a user |

Replace `{{userId}}` with the ID returned by the create request. You can also save it as a Postman environment variable named `userId` and use `{{userId}}` in the URLs.

To run the automated API tests (separate from manual Postman testing), run:

```powershell
npm test
```

The tests use the database configured in `.env` and clear the `users` and `posts` tables. Run them only against a local test database, not a database containing data you need to keep.

## Project map

```text
app/
  Controllers/UserController.js  Request handling
  Middleware/                    Authentication and async errors
  Models/User.js                 Reusable Knex queries
config/                          Knex configuration and shared connection
database/
  migrations/                    Users and posts tables
  seeds/                          Sample records
routes/users.js                  API endpoints
test/users.test.js               API tests
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the API |
| `npm run dev` | Start the API with automatic restarts |
| `npm run db:migrate` | Apply migrations |
| `npm run db:rollback` | Roll back the latest migration |
| `npm test` | Run the automated API tests |
