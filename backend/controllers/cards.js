import mongoose from 'mongoose';
import BadRequestError from '../utils/errors/BadRequestError.js';
import ForbiddenError from '../utils/errors/ForbiddenError.js';
import DocumentNotFoundError from '../utils/errors/DocumentNotFoundError.js';
import Card from '../models/card.js';

export const getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

export const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
        return;
      }
      next(err);
    });
};

export const deleteCardById = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .orFail(new DocumentNotFoundError('Карточка c указанным _id не найдена'))
    .then(async (card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          'Пользователь не является владельцем карточки',
        );
      }
      await Card.findByIdAndDelete(card._id);
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный _id'));
        return;
      }
      next(err);
    });
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new DocumentNotFoundError('Карточка c указанным _id не найдена'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        const newErr = new BadRequestError('Некорректный _id');
        next(newErr);
        return;
      }
      next(err);
    });
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new DocumentNotFoundError('Карточка c указанным _id не найдена'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный _id'));
        return;
      }
      next(err);
    });
};
