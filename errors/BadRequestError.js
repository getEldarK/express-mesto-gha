/* eslint-disable eol-last */
const { BAD_REQUEST_400 } = require('../utils/errors');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_400;
  }
}

module.exports = BadRequestError;