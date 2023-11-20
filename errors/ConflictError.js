/* eslint-disable eol-last */
const { CONFLICT_409 } = require('../utils/errors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_409;
  }
}

module.exports = ConflictError;