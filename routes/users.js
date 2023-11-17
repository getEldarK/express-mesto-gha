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
router.get('/me', getUserInfo);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.post('/', login);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router; // экспортировали роутер