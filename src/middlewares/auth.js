const jwt = require('jsonwebtoken');
const {asyncWrap} = require('./error');
const { userService } = require('../services');

const loginRequired = asyncWrap(async (req, res, next) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        const error = new Error('NEED_ACCESSTOKEN');
        error.statusCode = 401;

        throw error;
    }

    const veryfiedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await userService.getUserById(veryfiedToken.id);

    if (!user) {
        const error = new Error('INVALID_USER');
        error.statusCode = 400;

        throw error;
    }

    req.user = user;
    next();
});

module.exports = {
    loginRequired,
};