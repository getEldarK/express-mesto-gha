/* eslint-disable eol-last */

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6542160f29481bb55c523816',

//   next();
// });

app.use(router);
app.use(errors);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});