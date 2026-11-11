exports.seed = async function seed(knex) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Sample seeds are disabled in production.');
  }

  await knex('posts').del();
  await knex('users').del();

  const [userId] = await knex('users').insert({
    name: 'John Doe',
    email: 'john@example.test',
  });

  await knex('posts').insert({
    user_id: userId,
    title: 'Welcome to Knex',
    body: 'A sample post.',
  });
};
