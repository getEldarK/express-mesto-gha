/* eslint-disable eol-last */
const router = require('express').Router();
const {
  cardDataValidator,
  cardIdValidator,
} = require('../middlewares/validators/cardValidator');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Импорт валидаторов
const {
  cardDataValidator,
  cardIdValidator,
} = require('../middlewares/validators/cardValidator');

router.get('/', getCards);
router.post('/', cardDataValidator, createCard);

router.delete('/:cardId', cardIdValidator, deleteCardById);

router.put('/:cardId/likes', cardIdValidator, likeCard);

router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router; // экспортировали роутер