const error = require('../middlewares/errorConstructor');
const errorHandler = require('../middlewares/errorHandler');
const {userService} = require('../services');

const signUp = errorHandler(async(req, res) => {
    const {name, email, password, phone, age} = req.body;

    if (!name || !email || !password || !phone || !age) {
        throw new error("KEY_ERROR", 400);
    }

    await userService.signUp(name, email, password, phone, age)
    res.status(201).json({ message:"register success" })
})

module.exports = {
    signUp
}