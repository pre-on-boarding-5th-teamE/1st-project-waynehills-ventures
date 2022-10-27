const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/:typeId", errorHandler(boardController.writing));

router.get("/page/:typeId/:pageNum", errorHandler(boardController.list));

router.get(
  "/search/:typeId/:keyWord/:pageNum",
  errorHandler(boardController.search)
);

router.get("/detail/:typeId/:boardId", errorHandler(boardController.detail));

router.patch("/:typeId/:boardId", errorHandler(boardController.rewrite));

router.delete("/:typeId/:boardId", errorHandler(boardController.erase));

module.exports = {
  router,
};
