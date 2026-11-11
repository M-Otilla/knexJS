# A Lightweight Model Layer

Knex is a query builder, not an ORM. It does not generate model classes, model instances, or relationships. An application can use Knex directly in a controller, or add a small model layer to group reusable queries.

The example chooses the latter. [`User.js`](../example/app/Models/User.js) exports a factory that receives the shared Knex instance:

```js
function createUserModel(db) {
  return {
    all() {
      return db('users')
        .select('id', 'name', 'email', 'role')
        .where({ active: true })
        .orderBy('id');
    },

    findById(id) {
      return db('users')
        .select('id', 'name', 'email', 'role')
        .where({ id })
        .first();
    },
  };
}
```

The factory makes the database dependency explicit and allows the router to create a model for its controller:

```js
const User = createUserModel(db);
const controller = createUserController(User);
```

These methods return ordinary Knex query results—typically plain JavaScript objects—not Eloquent model instances. `findById` resolves to one row or `undefined` when no row matches.

## Reusable operations

The example model also implements `create`, `update`, `delete`, `findByEmail`, and `postsForUser`. The controller handles HTTP status codes and request validation; the model handles the queries.

Use this layer when it gives repeated or related database operations a clear home. For a one-off query, adding an abstraction that only forwards the query may not help. Knex itself does not require a model layer.

Continue with [database configuration and migrations](05-database.md), then see how the model uses Knex in [query builder patterns](06-queries.md).
