/* eslint-disable eol-last */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = BadRequestError;