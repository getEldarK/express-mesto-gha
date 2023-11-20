/* eslint-disable eol-last */
const { UNAUTHORIZED_401 } = require('../utils/errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_401;
  }
}

module.exports = UnauthorizedError;