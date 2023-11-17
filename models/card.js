/* eslint-disable eol-last */
const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя карточки должно быть длиной от 2 до 30 символов',
      },
    },

    link: {
      type: String,
      required: true,
      validate: {
        // validator - функция проверки данных. link - значение свойства link,
        // его можно обозначить как угодно, главное, чтобы совпадали обозначения в скобках
        validator: (link) => isUrl(link, { protocols: ['http', 'https'], require_protocol: true }), // если link не соответствует формату, вернётся false
        message: 'ссылка не соответствует формату', // когда validator вернёт false, будет использовано это сообщение
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);