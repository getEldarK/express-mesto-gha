/* eslint-disable eol-last */
const router = require('express').Router();
const {
  userIdValidator,
  userDataValidator,
  userAvatarValidator,
} = require('../middlewares/validators/userValidator');

const {
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:userId', userIdValidator, getUserById);

router.patch('/me', userDataValidator, updateProfile);

router.patch('/me/avatar', userAvatarValidator, updateAvatar);

module.exports = router; // экспортировали роутер