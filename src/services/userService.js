const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");
const error = require("../middlewares/errorConstructor");
const { User, Gender, UserAccess, sequelize } = require("../models");

const hashPassword = async (password) => {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  return await bcrypt.hash(password, salt);
};

const getAge = async (ageRange) => {
  switch (ageRange) {
    case "1~9":
      return 1;
    case "10~14":
      return 10;
    case "15~19":
      return 10;
    case "20~29":
      return 20;
    case "30~39":
      return 30;
    case "40~49":
      return 40;
    case "50~50":
      return 50;
    case "60~69":
      return 60;
    case "70~79":
      return 70;
    case "80~89":
      return 80;
    case "90~":
      return 90;
  }
};

const getNow = async () => {
  const now = new Date();
  const year = String(now.getFullYear()).padStart(2, "0");
  const month = String(now.getMonth()).padStart(2, "0");
  const day = String(now.getDay()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const tmp = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  return tmp;
};

const getUserByEmail = async (email) => {
  const [result] = await User.findAll({ where: { email: email } });

  return result;
};

const getDeletedUser = async (email) => {
  const [result] = await sequelize.query(
    `SELECT * FROM user
    WHERE email = "${email}"
    AND deleted_at IS NOT NULL
    `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result;
};

const getUserById = async (id) => {
  const [result] = await User.findAll({ where: { id: id } });

  return result;
};

const getGenderId = async (gender) => {
  const [result] = await Gender.findAll({ where: { name: gender } });

  return result.id;
};

const getUserAccess = async (id) => {
  const [result] = await UserAccess.findAll({
    where: { user_id: id },
  });

  return result;
};

const getAccessToken = async (id) => {
  const result = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return result;
};

const signUp = async (name, email, password, phone, age, gradeId, genderId) => {
  const user = await getUserByEmail(email);
  const deletedUser = await getDeletedUser(email);

  if (user) {
    if (!user.kakao_id) {
      throw new error("USER_OVERLAPED", 400);
    } else {
      if (user.password) {
        throw new error("USER_OVERLAPED", 400);
      } else {
        const hashedPassword = await hashPassword(password);

        await User.update(
          {
            password: hashedPassword,
            phone: phone,
            age: age,
          },
          { where: { email: email } }
        );
      }
    }
  } else {
    if (!deletedUser) {
      const hashedPassword = await hashPassword(password);

      await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        age: age,
        grade_id: gradeId,
        gender_id: genderId,
        platform_type_id: 1,
      });
    } else {
      await User.restore({
        where: { email: email },
      });

      const hashedPassword = await hashPassword(password);

      await User.update(
        {
          name: name,
          password: hashedPassword,
          phone: phone,
          age: age,
          grade_id: gradeId,
          gender_id: genderId,
        },
        { where: { email: email } }
      );
    }
  }
};

const signIn = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new error("INVALID_USER", 404);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new error("INVALID_PASSWORD");
  }

  const accessTime = await getNow();
  const check = await getUserAccess(user.id);

  if (!check) {
    await UserAccess.create({
      last_time: accessTime,
      user_id: user.id,
    });
  }

  await UserAccess.update(
    { last_time: accessTime },
    { where: { user_id: user.id } }
  );

  const accessToken = await getAccessToken(user.id);

  return accessToken;
};

const signInByKakao = async (code) => {
  const tokenResponse = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    qs.stringify({
      grant_type: "authorization_code",
      client_id: "3171b08ad1ae6e723be05f29f3f3c4f4",
      redirect_uri: "http://localhots:3000/auth/kakao/callback",
      code: code,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const userData = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const nickname = userData.data.kakao_account.profile.nickname;
  const email = userData.data.kakao_account.email;
  const kakaoId = userData.data.id;
  const ageRange = userData.data.kakao_account.age_range;
  const gender = userData.data.kakao_account.gender;

  const age = await getAge(ageRange);
  const genderId = await getGenderId(gender);

  const user = await getUserByEmail(email);
  const accessTime = await getNow();

  if (user.id && user.kakao_id) {
    const accessToken = await getAccessToken(user.id);

    return accessToken;
  } else if (user.id && !user.kakao_Id) {
    await User.update(
      { kakao_id: kakaoId, platform_type_id: 2 },
      { where: { email: email } }
    );

    await UserAccess.update(
      { last_time: accessTime },
      { where: { user_id: user.id } }
    );

    const accessToken = await getAccessToken(user.id);

    return accessToken;
  } else {
    await User.create({
      name: nickname,
      email: email,
      age: age,
      grade_id: 3,
      gender_id: genderId,
      platform_type_id: 2,
      kakao_id: kakaoId,
    });

    const newUser = await getUserByEmail(email);

    await UserAccess.create({
      last_time: accessTime,
      user_id: newUser.id,
    });

    const accessToken = await getAccessToken(newUser.id);

    return accessToken;
  }
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id: id } });
};

module.exports = {
  getUserById,
  signUp,
  signIn,
  signInByKakao,
  deleteUser,
};
