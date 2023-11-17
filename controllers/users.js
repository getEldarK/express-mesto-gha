/* eslint-disable eol-last */
const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/errors');

// Функция, которая возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

const getUserInfo = (req, res) => {
  console.log(req);
};

// Функция, которая возвращает пользователя по _id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => res.status(CREATED_CODE).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при создании пользователя. ${errorMessage}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const login = (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // console.log(user._id);
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true,
      })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

// Функция, которая обновляет профиль пользователя
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, about }, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при обновлении профиля. ${errorMessage}`,
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция, которая обновляет аватар из профиля пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar }, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при обновлении аватара. ${errorMessage}`,
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};