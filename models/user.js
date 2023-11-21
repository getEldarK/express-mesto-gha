/* eslint-disable eol-last */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const isEmail = require('validator/lib/isEmail');
const isUrl = require('validator/lib/isURL');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
      default: 'Жак-Ив Кусто',
    },

    about: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Информация о пользователе должна быть длиной от 2 до 30 символов',
      },
      default: 'Исследователь',
    },

    avatar: {
      type: String,
      validate: {
        // validator - функция проверки данных. avatar - значение свойства avatar,
        // его можно обозначить как угодно, главное, чтобы совпадали обозначения в скобках
        // если avatar не соответствует формату, вернётся false
        validator: (avatar) => isUrl(avatar, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'ссылка не соответствует формату', // когда validator вернёт false, будет использовано это сообщение
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'e-mail не соответствует формату адреса электронной почты',
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
    // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);