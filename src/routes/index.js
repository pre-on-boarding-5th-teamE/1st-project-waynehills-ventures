const express = require("express");
const router = express.Router();
const statisticsRouter = require("./statisticsRouter");
const boardRouter = require("./boardRouter");

router.use("/statistics", statisticsRouter.router);

router.use("/board", boardRouter.router);

module.exports = router;
