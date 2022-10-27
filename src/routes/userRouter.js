const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// userRouter.post('/signin/kakao', userController.signInByKakao);

module.exports = {
    router
}