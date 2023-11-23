/* eslint-disable eol-last */
const {
  PORT = 3000,
  DB = 'mongodb://127.0.0.1:27017/mestodb',
  JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b',
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};