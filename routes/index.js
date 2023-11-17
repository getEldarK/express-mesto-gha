/* eslint-disable eol-last */
const router = require('express').Router(); // импортируем роутер из express
const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

const { NOT_FOUND_ERROR_CODE } = require('../utils/errors');

router.post('/signup', createUser);
router.post('/signin', login);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router;