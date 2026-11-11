# Query Builder Patterns

Knex builds a query by chaining methods. Await the builder to execute it and return rows:

```js
const users = await db('users')
  .select('id', 'name', 'email')
  .where({ active: true })
  .orderBy('name', 'asc');

const user = await db('users')
  .where({ id: 42 })
  .first();
```

`select` chooses columns, `where` filters rows, `orderBy` sorts the result, and `first` returns one matching row or `undefined`. This composes SQL; it does not create Eloquent model objects.

## Create, update, and delete

The example model implements the basic mutations:

```js
const [id] = await db('users').insert({
  name: 'Ari Lee',
  email: 'ari@example.test',
});

await db('users')
  .where({ id })
  .update({ name: 'Ari Smith' });

await db('users')
  .where({ id })
  .del();
```

Always scope updates and deletes to the intended rows. Validate request data before using it, and check the affected-row count when the application must distinguish a missing record from a successful mutation. The example's controller and [`User.js`](../example/app/Models/User.js) demonstrate those checks.

## Joins

An inner join returns only matching user/post rows; a left join keeps users that do not have a post:

```js
const posts = await db('users')
  .join('posts', 'users.id', 'posts.user_id')
  .select('users.name as author', 'posts.title');

const usersWithPosts = await db('users')
  .leftJoin('posts', 'users.id', 'posts.user_id')
  .select('users.id', 'users.name', 'posts.title');
```

A user with multiple posts appears in multiple joined rows. The example's `postsForUser` uses a left join so it can return a user with an empty posts array. Its controller shapes the joined rows into one user object and a `posts` array.

## Bind values in raw SQL

Prefer the query builder for common operations. When raw SQL is useful, bind inputs rather than interpolating them into the SQL string:

```js
const user = await db('users')
  .whereRaw('?? = ?', ['users.email', email])
  .first();
```

In Knex raw bindings, `??` is an identifier placeholder and `?` is a value placeholder. A parameterized raw query uses the same value-binding rule:

```js
const result = await db.raw(
  'select * from users where email = ?',
  [email]
);
```

Never concatenate untrusted input into SQL text. The example validates the email in the controller and uses a bound query in [`User.js`](../example/app/Models/User.js).
