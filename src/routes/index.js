const express = require("express");
const router = express.Router();
const boardRouter = require("./boardRouter");

router.use("/board", boardRouter.router);
module.exports = router;
