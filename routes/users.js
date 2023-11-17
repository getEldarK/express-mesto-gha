/* eslint-disable eol-last */
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  login,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getUserInfo);
router.post('/signup', createUser);
router.post('/signup', login);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router; // экспортировали роутер