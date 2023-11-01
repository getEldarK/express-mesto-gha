const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users'); // импортируем роутер users.js

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: '6541faeca8f3af78ff187071' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', users);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});