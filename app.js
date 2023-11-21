/* eslint-disable eol-last */

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const bodyParser = require('body-parser');

const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6542160f29481bb55c523816',

//   next();
// });

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});