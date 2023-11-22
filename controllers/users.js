/* eslint-disable eol-last */
const {
  CastError,
  ValidationError,
} = require('mongoose').Error;

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

const { CREATED_201 } = require('../utils/errors');

// Импорт переменной секретного ключа
const { JWT_SECRET } = require('../utils/errors');

// Функция, которая возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next); // добавили catch, такая запись эквивалентна следующей: .catch(err => next(err));
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

// Функция, которая возвращает пользователя по _id
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    // вернём записанные в базу данные
    .then((user) => res.status(CREATED_201).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true, // указали браузеру посылать куки, только если запрос с того же домена
      })
      // отправим токен пользователю
        .send({ token });
      // .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из системы' });
};

const updateUserData = (req, res, next, updateOptions) => {
  const { _id: userId } = req.user;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    userId,
    updateOptions, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
          next(new BadRequestError(`Переданы некорректные данные: ${errorMessage}`));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

// Функция, которая обновляет профиль пользователя
const updateProfile = (req, res, next) => {
  const updateOptions = req.body;
  updateUserData(req, res, next, updateOptions);
};

// Функция, которая обновляет аватар из профиля пользователя
const updateAvatar = (req, res, next) => {
  const updateOptions = req.body;
  updateUserData(req, res, next, updateOptions);
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  login,
  logout,
  updateProfile,
  updateAvatar,
};