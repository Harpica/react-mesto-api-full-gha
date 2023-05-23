import HttpError from './HttpError.js';

class BadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
