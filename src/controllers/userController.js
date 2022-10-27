const error = require('../middlewares/errorConstructor');
const errorHandler = require('../middlewares/errorHandler');
const userService = require('../services/userService');

const signUp = errorHandler(async(req, res) => {
    const {name, email, password, phone, age, gradeId, genderId} = req.body;

    if (!name || !email || !password || !phone || !age || !gradeId || !genderId) {
        throw new error("KEY_ERROR", 400);
    }

    await userService.signUp(name, email, password, phone, age, gradeId, genderId)
    res.status(201).json({ message:"register success" })
})

const signIn = errorHandler(async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new error("KEY_ERROR", 400);
    }

    const accessToken = await userService.signIn(email, password);
    res.status(200).json({accessToken});
})

module.exports = {
    signUp,
    signIn
}