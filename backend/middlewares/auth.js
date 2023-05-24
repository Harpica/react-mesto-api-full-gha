import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../utils/constants.js';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';

const auth = (req, _res, next) => {
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, JWT_KEY);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }
};

export default auth;
