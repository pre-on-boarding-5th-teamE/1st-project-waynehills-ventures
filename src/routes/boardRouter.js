const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/", errorHandler(boardController.writing));

router.get("/page/:pageNum", errorHandler(boardController.list));

module.exports = {
  router,
};
