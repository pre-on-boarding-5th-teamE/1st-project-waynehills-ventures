const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/", errorHandler(boardController.writing));

router.get("/page/:typeId/:pageNum", errorHandler(boardController.list));

router.get("/search/:keyWord", errorHandler(boardController.search));

router.get("/detail/:boardId", errorHandler(boardController.detail));

router.patch("/:boardId", errorHandler(boardController.rewrite));

module.exports = {
  router,
};
