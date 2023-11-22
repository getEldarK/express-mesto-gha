/* eslint-disable eol-last */
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  // извлечём токен и сохраняем его в переменную
  const token = req.cookies.jwt;

  // убеждаемся, что он есть
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};