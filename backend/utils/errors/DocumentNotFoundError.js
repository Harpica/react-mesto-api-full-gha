import HttpError from './HttpError.js';

class DocumentNotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(message);
    this.statusCode = 404;
  }
}

export default DocumentNotFoundError;
