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

    findByEmail(email) {
      return db('users')
        .whereRaw('?? = ?', ['users.email', email])
        .first();
    },

    async create(data) {
      const [id] = await db('users').insert(data);
      return this.findById(id);
    },

    async update(id, data) {
      const updated = await db('users')
        .where({ id })
        .update({ ...data, updated_at: db.fn.now() });

      return updated ? this.findById(id) : null;
    },

    delete(id) {
      return db('users').where({ id }).del();
    },

    postsForUser(id) {
      return db('users')
        .leftJoin('posts', 'users.id', 'posts.user_id')
        .where('users.id', id)
        .select(
          'users.id as user_id',
          'users.name as user_name',
          'posts.id as post_id',
          'posts.title as post_title',
          'posts.body as post_body',
        )
        .orderBy('posts.id');
    },
  };
}

module.exports = createUserModel;
