import HttpError from './HttpError.js';

class ForbiddenError extends HttpError {
  constructor(message = 'Access is forbidden') {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
