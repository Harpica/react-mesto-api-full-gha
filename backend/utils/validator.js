import { Joi } from 'celebrate';
import isURL from 'validator/lib/isURL.js';

const validator = {
  auth: {
    login: {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    },
    registration: {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().custom((value, helper) => {
          if (!isURL(value)) {
            return helper.message('Value is not valid url');
          }
          return value;
        }),
      }),
    },
  },
  users: {
    id: {
      params: {
        id: Joi.string().required().length(24).hex(),
      },
    },
    update: {
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(30).required(),
      }),
    },
    avatar: {
      body: Joi.object().keys({
        avatar: Joi.string()
          .required()
          .custom((value, helper) => {
            if (!isURL(value)) {
              return helper.message('Value is not valid url');
            }
            return value;
          }),
      }),
    },
  },
  cards: {
    add: {
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string()
          .required()
          .custom((value, helper) => {
            if (!isURL(value)) {
              return helper.message('Value is not valid url');
            }
            return value;
          }),
      }),
    },
    id: {
      params: {
        cardId: Joi.string().required().length(24).hex(),
      },
    },
  },
};

export default validator;
