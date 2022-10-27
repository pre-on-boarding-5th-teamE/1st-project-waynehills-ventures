const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const error = require('../middlewares/errorConstructor');
const {User, sequelize, UserAccess} = require('../models');

const hashPassword = async(password) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound)

    return await bcrypt.hash(password, salt);
}

const getNow = async() => {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(2, "0");
    const month = String(now.getMonth()).padStart(2, "0");
    const day = String(now.getDay()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const tmp = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    return tmp
}

const getUserByEmail = async(email) => {
    const [result] = await User.findAll({ where: {email: email}});
    
    return result;
}

const getUserById = async(id) => {
    const [result] = await User.findAll({where : {id: id}});

    return result;
}

const getUserAccess = async(id) => {
    const [result] = await UserAccess.findAll({
        where: {user_id: id}
    })
    
    return result;
}

const signUp = async(name, email, password, phone, age, gradeId, genderId) => {
    const check = await getUserByEmail(email);

    if (check) {
        throw new error("USER_OVERLAPED", 400);
    }

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
    })
}

const signIn = async(email, password) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new error("INVALID_USER", 404);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new error("INVALID_PASSWORD");
    }
    
    const accessTime = await getNow();
    const check = await getUserAccess(user.id)

    if (!check) {
        await UserAccess.create({
            last_time: accessTime,
            user_id: user.id
        })
    }
    
    await UserAccess.update({last_time: accessTime}, {where: {user_id: user.id}})

    const accessToken = jwt.sign({
        id: user.id},
        process.env.JWT_SECRET,
        {
            algorithm: process.env.ALGORITHM,
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )

    return accessToken;
}

module.exports = {
    getUserById,
    signUp,
    signIn
}