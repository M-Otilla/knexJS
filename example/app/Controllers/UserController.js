function createUserController(User) {
  return {
    async index(req, res) {
      const users = await User.all();
      return res.json({ data: users });
    },

    async show(req, res) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({ data: user });
    },

    async search(req, res) {
      const email = typeof req.query.email === 'string'
        ? req.query.email.trim().toLowerCase()
        : '';
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Provide a valid email address.' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({ data: user });
    },

    async store(req, res) {
      const input = validateUser(req.body);
      if (input.error) {
        return res.status(400).json({ error: input.error });
      }

      const user = await User.create(input.data);
      return res.status(201).json({ data: user });
    },

    async update(req, res) {
      const input = validateUser(req.body, true);
      if (input.error) {
        return res.status(400).json({ error: input.error });
      }

      const user = await User.update(req.params.id, input.data);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({ data: user });
    },

    async destroy(req, res) {
      const deleted = await User.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(204).end();
    },

    async posts(req, res) {
      const rows = await User.postsForUser(req.params.id);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const user = { id: rows[0].user_id, name: rows[0].user_name };
      const posts = rows
        .filter((row) => row.post_id !== null)
        .map((row) => ({
          id: row.post_id,
          title: row.post_title,
          body: row.post_body,
        }));

      return res.json({ data: { user, posts } });
    },
  };
}

function validateUser(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A JSON object is required.' };
  }

  const data = {};
  if ('name' in body) {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return { error: 'Name must be a non-empty string.' };
    }
    data.name = body.name.trim();
  }

  if ('email' in body) {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!isValidEmail(email)) {
      return { error: 'A valid email address is required.' };
    }
    data.email = email;
  }

  if (!partial && (!data.name || !data.email)) {
    return { error: 'Name and email are required.' };
  }
  if (partial && Object.keys(data).length === 0) {
    return { error: 'Provide a name or email to update.' };
  }

  return { data };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = createUserController;
