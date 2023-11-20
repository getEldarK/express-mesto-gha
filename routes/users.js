/* eslint-disable eol-last */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/errors');

const {
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  // валидируем параметры, alphanum - буквенно-цифровые символы
  // hex - шестнадцатеричная строка
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
      .required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regEx),
  }),
}), updateAvatar);

module.exports = router; // экспортировали роутер