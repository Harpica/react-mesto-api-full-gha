import express from 'express';
import { celebrate } from 'celebrate';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../../controllers/cards.js';
import auth from '../../middlewares/auth.js';
import validator from '../../utils/validator.js';

const cards = express.Router();

cards.use(auth);
cards.get('/', getCards);
cards.post('/', celebrate(validator.cards.add), createCard);
cards.put('/:cardId/likes', celebrate(validator.cards.id), likeCard);
cards.delete('/:cardId/likes', celebrate(validator.cards.id), dislikeCard);
cards.delete('/:cardId', celebrate(validator.cards.id), deleteCardById);

export default cards;
