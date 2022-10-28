const error = require("../middlewares/errorConstructor");
const errorHandler = require("../middlewares/errorHandler");
const userService = require("../services/userService");

const signUp = errorHandler(async (req, res) => {
  const { name, email, password, phone, age, gradeId, genderId } = req.body;

  if (!name || !email || !password || !phone || !age || !gradeId || !genderId) {
    throw new error("KEY_ERROR", 400);
  }

  await userService.signUp(
    name,
    email,
    password,
    phone,
    age,
    gradeId,
    genderId
  );
  res.status(201).json({ message: "register success" });
});

const signIn = errorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new error("KEY_ERROR", 400);
  }

  const accessToken = await userService.signIn(email, password);
  res.status(200).json({ accessToken });
});

const signInByKakao = errorHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new error("KEY_ERROR", 400);
  }

  const accessToken = await userService.signInByKakao(code);
  res.status(200).json({ accessToken });
});

const deleteUser = errorHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new error("KEY_ERROR", 400);
  }

  await userService.deleteUser(userId);
  res.status(204).send();
});

module.exports = {
  signUp,
  signIn,
  signInByKakao,
  deleteUser,
};
