const express = require('express');
const {userController} = require('../controllers');

const userRouter = express.Router();

userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);
userRouter.post('/signin/kakao', userController.signInByKakao);

module.exports = userRouter