const express = require("express");

const router = express.Router();
const statisticsRouter = require("./statisticsRouter");
const boardRouter = require("./boardRouter");
const userRouter = require('./userRouter');

router.use("/statistics", statisticsRouter.router);

router.use("/board", boardRouter.router);

router.use('/user', userRouter.router);

module.exports = router;
