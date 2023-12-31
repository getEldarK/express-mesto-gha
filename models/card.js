/* eslint-disable eol-last */
// Импорт пакетов
const mongoose = require('mongoose');

// Импорт валидатора URL
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      // у карточки есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: [true, 'не передано имя карточки'], // оно должно быть у каждой карточки, так что имя — обязательное поле
      minlength: [2, 'длина имени карточки должна быть не менее 2 символов'], // минимальная длина имени — 2 символа
      maxlength: [30, 'длина имени карточки должна быть не более 30 символов'], // а максимальная — 30 символов
    },
    link: {
      // у карточки есть ссылка на картинку — опишем требования к ссылке на картинку в схеме:
      type: String, // ссылка на картинку — это строка
      validate: {
        // validator - функция проверки данных. link - значение свойства link,
        // его можно обозначить как угодно, главное, чтобы совпадали обозначения в скобках
        validator: (link) => isUrl(link, { protocols: ['http', 'https'], require_protocol: true }), // если link не соответствует формату, вернётся false
        message: 'ссылка не соответствует формату', // когда validator вернёт false, будет использовано это сообщение
      },
      required: [true, 'не передана ссылка на изображение'], // оно должно быть у каждого пользователя, так что ссылка — обязательное поле
    },
    owner: {
      // у карточки есть ссылка на модель автора карточки — опишем требования к ссылке в схеме:
      type: mongoose.Schema.Types.ObjectId, // информация о себе — это строка
      ref: 'user',
      required: true,
    },
    likes: {
      // у карточки есть ссылка на модель автора карточки — опишем требования к ссылке в схеме:
      type: [mongoose.Schema.Types.ObjectId], // информация о себе — это строка
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }, // отключаем поле "__v"
);

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);