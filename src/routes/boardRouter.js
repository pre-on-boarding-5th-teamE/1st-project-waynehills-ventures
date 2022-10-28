const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const errorHandler = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");

router.post(
  "/:typeId",
  auth.loginRequired,
  errorHandler(boardController.writing)
);

router.get(
  "/page/:typeId/:pageNum",
  auth.loginRequired,
  errorHandler(boardController.list)
);

router.get(
  "/search/:typeId/:keyWord/:pageNum",
  auth.loginRequired,
  errorHandler(boardController.search)
);

router.get(
  "/detail/:typeId/:boardId",
  auth.loginRequired,
  errorHandler(boardController.detail)
);

router.patch(
  "/:typeId/:boardId",
  auth.loginRequired,
  errorHandler(boardController.rewrite)
);

router.delete(
  "/:typeId/:boardId",
  auth.loginRequired,
  errorHandler(boardController.erase)
);

module.exports = {
  router,
};
