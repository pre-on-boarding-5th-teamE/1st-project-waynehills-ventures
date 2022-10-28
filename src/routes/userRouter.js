const express = require("express");
const userController = require("../controllers/userController");
const { loginRequired } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/signin/kakao", userController.signInByKakao);
router.delete("", loginRequired, userController.deleteUser);

module.exports = {
  router,
};
