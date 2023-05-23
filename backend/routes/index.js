import express from 'express';
import { celebrate, errors } from 'celebrate';
import errorHandler from '../middlewares/errorHandler.js';
import DocumentNotFoundError from '../utils/errors/DocumentNotFoundError.js';
import cards from './partials/cards.js';
import users from './partials/users.js';
import validator from '../utils/validator.js';
import { createUser, loginUser } from '../controllers/users.js';

const routes = express.Router();

routes.post('/signin', celebrate(validator.auth.login), loginUser);
routes.post('/signup', celebrate(validator.auth.registration), createUser);
routes.use('/users', users);
routes.use('/cards', cards);
// Any other path
routes.use(() => {
  throw new DocumentNotFoundError('Данная страница не найдена');
});
// Middleware to handle all errors
routes.use(errors());
routes.use(errorHandler);

export default routes;
