const express = require("express");
const router = express.Router();
const statisticsRouter = require("./statisticsRouter");

router.use("/statistics", statisticsRouter.router);

module.exports = router;
