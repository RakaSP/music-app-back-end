const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this._name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
