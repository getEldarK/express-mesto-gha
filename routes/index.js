/* eslint-disable eol-last */
const router = require('express').Router(); // импортируем роутер из express
const { celebrate, Joi } = require('celebrate');
const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { regEx } = require('../utils/errors');

const { NOT_FOUND_404 } = require('../utils/errors');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regEx),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/users', auth, users);

router.use('/cards', auth, cards);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router;