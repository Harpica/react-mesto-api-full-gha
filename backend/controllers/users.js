import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import BadRequestError from '../utils/errors/BadRequestError.js';
import DocumentNotFoundError from '../utils/errors/DocumentNotFoundError.js';
import User from '../models/user.js';
import { JWT_KEY } from '../utils/constants.js';
import ConflictError from '../utils/errors/ConflictError.js';

export const getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const findUserById = (id, res, next) => {
  User.findById(id)
    .orFail(
      new DocumentNotFoundError('Пользователь по указанному _id не найден'),
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный _id'));
        return;
      }
      next(err);
    });
};

export const getUserById = (req, res, next) => {
  const { id } = req.params;
  findUserById(id, res, next);
};

export const getMyUser = (req, res, next) => {
  const id = req.user;
  findUserById(id, res, next);
};

export const createUser = (req, res, next) => {
  const userData = req.body;
  userData.password = User.generateHash(userData.password);
  User.create(userData)
    .then((user) => {
      const newUser = user.getUserWithRemovedPassport();
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой e-mail уже используется'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
        return;
      }
      next(err);
    });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ data: user });
    })
    .catch(next);
};

export const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(
      new DocumentNotFoundError('Пользователь по указанному _id не найден'),
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
        return;
      }
      next(err);
    });
};

export const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(
      new DocumentNotFoundError('Пользователь по указанному _id не найден'),
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
        return;
      }
      next(err);
    });
};
