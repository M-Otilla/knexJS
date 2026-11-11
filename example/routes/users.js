const express = require('express');
const createUserController = require('../app/Controllers/UserController');
const createAuthMiddleware = require('../app/Middleware/auth');
const asyncHandler = require('../app/Middleware/async-handler');
const createUserModel = require('../app/Models/User');

function createUsersRouter({ db, apiToken }) {
  const router = express.Router();
  const User = createUserModel(db);
  const controller = createUserController(User);

  router.use(createAuthMiddleware(apiToken));
  router.get('/search', asyncHandler(controller.search));
  router.get('/', asyncHandler(controller.index));
  router.post('/', asyncHandler(controller.store));
  router.get('/:id/posts', validateId, asyncHandler(controller.posts));
  router.get('/:id', validateId, asyncHandler(controller.show));
  router.patch('/:id', validateId, asyncHandler(controller.update));
  router.delete('/:id', validateId, asyncHandler(controller.destroy));

  return router;
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer.' });
  }

  req.params.id = id;
  return next();
}

module.exports = createUsersRouter;
