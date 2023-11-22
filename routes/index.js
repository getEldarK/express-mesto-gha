/* eslint-disable eol-last */
const router = require('express').Router(); // импортируем роутер из express
const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');
const NotFoundError = require('../errors/NotFoundError');
// роуты, не требующие авторизации - регистрация и логин
router.post('/signup', createUserValidator, createUser); // добавили роутер для регистрации



router.post('/signin', loginValidator, login); // добавили роутеры для авторизации

router.post('/signin', loginValidator, login); // добавили роутеры для авторизации

router.use('/users', auth, users);

router.use('/cards', auth, cards);

router.get('/signout', auth, logout); // добавили роутер для выхода из системы (очищзения куки)

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

module.exports = router;