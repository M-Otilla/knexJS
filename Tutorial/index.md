# KnexJS for Laravel Developers - Full Tutorial Series

Welcome to this comprehensive guide on using Knex.js in Node.js with a directory structure and workflow familiar to Laravel developers.

---

## 📚 Quick Links

| # | File | Description | Read Me |
|---|------|-------------|---------|
| 1 | [Introduction](01-introduction.md) | Prerequisites and overview | [Next →](02-setup.md) |
| 2 | [Setup & Dependencies](02-setup.md) | Node.js, npm, and Knex installation | [Next →](03-routing-controls.md) |
| 3 | [Routing & Controllers](03-routing-controls.md) | Express patterns matching Laravel conventions | [Next →](04-models.md) |
| 4 | [Model Pattern](04-models.md) | Optional lightweight layer for reusable queries | [Next →](05-database.md) |
| 5 | [Database & Migrations](05-database.md) | Knex.js migrations similar to Artisan | [Next →](06-queries.md) |
| 6 | [Query Builder](06-queries.md) | CRUD, joins, and bound values | Done |
| 7 | [45-Minute Server Build Script](07-server-js-knex-45-minute-script.md) | Presenter script covering the full tutorial and building an Express + Knex API | Open script |

---

## 🛠️ Example Project Files

This tutorial comes with a working Express and Knex example project:

```text
example/
├── app/
│   ├── Controllers/      # HTTP request handlers
│   ├── Middleware/       # Authentication and async errors
│   └── Models/           # Reusable Knex queries
├── config/               # Knex configuration and connection
├── database/
│   ├── migrations/       # Schema changes
│   └── seeds/            # Sample data
├── routes/users.js       # Express API router
├── app.js                # Express application
└── server.js             # Server entry point
```

### Quick start

```powershell
cd example
npm install
Copy-Item .env.example .env
npm run db:migrate
npx knex seed:run --specific=001_sample_users.js
npm start
```

Set a private `API_TOKEN` in `.env` before starting the server. The sample seed clears and rebuilds the example `users` and `posts` tables; use it only with the local training database. The seed directory also contains an unfinished generated placeholder, so run only the named seed above rather than `db:seed` or `db:setup`.

---

## 🧪 Test Your Setup

The API listens on port 3000. User endpoints require the bearer token configured in `.env`.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:3000/api/users` | GET | List active users |
| `http://localhost:3000/api/users/search?email=john%40example.test` | GET | Find a user by email |
| `http://localhost:3000/api/users/{{userId}}/posts` | GET | Get a user and their posts |
| `http://localhost:3000/api/users` | POST | Create a user |

---

## 📖 Navigation

- [← Previous: Introduction](01-introduction.md)
- [Next: Setup →](02-setup.md)
- [Presenter Script: Build an Express Server with Knex](07-server-js-knex-45-minute-script.md)
