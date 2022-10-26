const express = require('express');
const {userController} = require('../controllers');

const userRouter = express.Router();

userRouter.use('/signin', userController.signIn);

module.exports = userRouter;