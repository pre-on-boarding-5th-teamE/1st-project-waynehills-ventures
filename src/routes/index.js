const express = require("express");
const userRouter = require('./userRouter');

const router = express.Router();
const statisticsRouter = require("./statisticsRouter");
const boardRouter = require("./boardRouter");

router.use("/statistics", statisticsRouter.router);

router.use("/board", boardRouter.router);

router.use('/user', userRouter);

module.exports = router;
