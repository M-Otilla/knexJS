# Routes, Middleware, and Controllers

Knex does not provide an HTTP framework. The example uses Express for HTTP concerns and keeps database calls in its model layer.

## Follow a request

The example mounts its users router at `/api/users`. A router path of `/` therefore handles `GET /api/users`:

```js
// app.js
app.use(express.json());
app.use('/api/users', createUsersRouter({ db, apiToken }));
```

The router creates a model and controller, then connects middleware and handlers:

```js
// routes/users.js
router.use(createAuthMiddleware(apiToken));
router.get('/', asyncHandler(controller.index));
router.post('/', asyncHandler(controller.store));
router.get('/:id', validateId, asyncHandler(controller.show));
router.patch('/:id', validateId, asyncHandler(controller.update));
```

Because authentication is registered with `router.use`, it applies to every route in this router. `validateId` rejects malformed IDs before the controller runs. The complete route list is in [`example/routes/users.js`](../example/routes/users.js).

## Middleware

Express middleware receives `req`, `res`, and `next`. It can end a request with a response or call `next()` to pass control along. The example checks for the configured bearer token:

```js
function requireApiToken(req, res, next) {
  if (req.get('authorization') !== `Bearer ${apiToken}`) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  return next();
}
```

This is a small teaching example, not a complete authentication system. Do not treat possession of a static API token as user authentication for a production application.

## Controller responsibilities

Controllers translate HTTP input into model calls and choose response status codes and shapes. For example, the list handler returns a JSON data envelope:

```js
async index(req, res) {
  const users = await User.all();
  return res.json({ data: users });
}
```

The `store` handler validates the request body before inserting a record and returns `201 Created`. The `show` handler returns `404` when a user does not exist. See [`UserController.js`](../example/app/Controllers/UserController.js) for the complete handlers and validation.

## Async and application errors

[`async-handler.js`](../example/app/Middleware/async-handler.js) forwards rejected async handlers to Express error middleware. The application returns a generic `500` response for unexpected errors and logs the error on the server; it does not send internal error details to the client. Unmatched routes return `404`.

The app and server are separate: [`app.js`](../example/app.js) builds and exports the Express app, while [`server.js`](../example/server.js) starts listening. This lets tests create an app without binding the normal server port.
