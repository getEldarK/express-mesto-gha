/* eslint-disable eol-last */
const { NOT_FOUND_404 } = require('../utils/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_404;
  }
}

module.exports = NotFoundError;