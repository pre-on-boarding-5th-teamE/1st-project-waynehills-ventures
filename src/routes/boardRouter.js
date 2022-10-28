const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const errorHandler = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");
const {
  createAvailable,
  readAvailable,
  updateAvailable,
  deleteAvailable,
} = require("../middlewares/boardAccess");

router.post(
  "/:typeId",
  auth.loginRequired,
  createAvailable,
  errorHandler(boardController.writing)
);

router.get(
  "/page/:typeId/:pageNum",
  auth.loginRequired,
  errorHandler(readAvailable),
  errorHandler(boardController.list)
);

router.get(
  "/search/:typeId/:keyWord/:pageNum",
  auth.loginRequired,
  readAvailable,
  errorHandler(boardController.search)
);

router.get(
  "/detail/:typeId/:boardId",
  auth.loginRequired,
  readAvailable,
  errorHandler(boardController.detail)
);

router.patch(
  "/:typeId/:boardId",
  auth.loginRequired,
  updateAvailable,
  errorHandler(boardController.rewrite)
);

router.delete(
  "/:typeId/:boardId",
  auth.loginRequired,
  deleteAvailable,
  errorHandler(boardController.erase)
);

module.exports = {
  router,
};
