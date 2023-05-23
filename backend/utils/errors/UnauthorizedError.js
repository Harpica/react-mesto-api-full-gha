import HttpError from './HttpError.js';

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
