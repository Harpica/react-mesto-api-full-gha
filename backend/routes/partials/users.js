import express from 'express';
import { celebrate } from 'celebrate';
import {
  getMyUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateUser,
} from '../../controllers/users.js';
import auth from '../../middlewares/auth.js';
import validator from '../../utils/validator.js';

const users = express.Router();

users.use(auth);
users.get('/', getUsers);
users.get('/me', getMyUser);
users.patch('/me/avatar', celebrate(validator.users.avatar), updateAvatar);
users.patch('/me', celebrate(validator.users.update), updateUser);
users.get('/:id', celebrate(validator.users.id), getUserById);

export default users;
