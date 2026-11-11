process.env.NODE_ENV = 'test';
process.env.DB_FILENAME = ':memory:';

const assert = require('node:assert/strict');
const { after, before, beforeEach, test } = require('node:test');
const { once } = require('node:events');
const { createApp, db } = require('../app');

const app = createApp({ apiToken: 'test-token' });
const auth = { authorization: 'Bearer test-token' };
let server;
let baseUrl;
let userId;

before(async () => {
  await db.migrate.latest();
  server = app.listen(0);
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await db('posts').del();
  await db('users').del();
  [userId] = await db('users').insert({
    name: 'Jane Doe',
    email: 'jane@example.test',
  });
});

after(async () => {
  if (server) {
    server.close();
    await once(server, 'close');
  }
  await db.destroy();
});

test('requires a token and supports user queries, CRUD, and joins', async (t) => {
  await t.test('rejects requests without a token', async () => {
    const response = await fetch(`${baseUrl}/api/users`);
    assert.equal(response.status, 401);
  });

  await t.test('lists, searches, and shows users', async () => {
    const list = await fetch(`${baseUrl}/api/users`, { headers: auth });
    assert.equal(list.status, 200);
    assert.equal((await list.json()).data.length, 1);

    const search = await fetch(
      `${baseUrl}/api/users/search?email=${encodeURIComponent('jane@example.test')}`,
      { headers: auth },
    );
    assert.equal(search.status, 200);
    assert.equal((await search.json()).data.email, 'jane@example.test');

    const invalidSearch = await fetch(
      `${baseUrl}/api/users/search?email=${encodeURIComponent("' OR 1=1 --")}`,
      { headers: auth },
    );
    assert.equal(invalidSearch.status, 400);

    const show = await fetch(`${baseUrl}/api/users/${userId}`, { headers: auth });
    assert.equal(show.status, 200);
    assert.equal((await show.json()).data.name, 'Jane Doe');

    const invalidId = await fetch(`${baseUrl}/api/users/invalid`, { headers: auth });
    assert.equal(invalidId.status, 400);
  });

  await t.test('creates, updates, and deletes a user', async () => {
    const invalid = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Missing email' }),
    });
    assert.equal(invalid.status, 400);

    const created = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ari Lee', email: 'ARI@example.test' }),
    });
    assert.equal(created.status, 201);
    const user = (await created.json()).data;
    assert.equal(user.email, 'ari@example.test');

    const updated = await fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ari Smith' }),
    });
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).data.name, 'Ari Smith');

    const deleted = await fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'DELETE',
      headers: auth,
    });
    assert.equal(deleted.status, 204);
  });

  await t.test('joins users and their posts', async () => {
    const empty = await fetch(`${baseUrl}/api/users/${userId}/posts`, { headers: auth });
    assert.deepEqual((await empty.json()).data.posts, []);

    await db('posts').insert({
      user_id: userId,
      title: 'A Knex post',
      body: 'A post linked to a user.',
    });

    const response = await fetch(`${baseUrl}/api/users/${userId}/posts`, { headers: auth });
    const result = (await response.json()).data;
    assert.equal(result.user.name, 'Jane Doe');
    assert.equal(result.posts[0].title, 'A Knex post');
  });
});
