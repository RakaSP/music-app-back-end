const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this._name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
