function createAuthMiddleware(apiToken) {
  return function requireApiToken(req, res, next) {
    const authorization = req.get('authorization');

    if (authorization !== `Bearer ${apiToken}`) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    return next();
  };
}

module.exports = createAuthMiddleware;
