const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this._name = 'InvariantError';
  }
}
module.exports = InvariantError;
