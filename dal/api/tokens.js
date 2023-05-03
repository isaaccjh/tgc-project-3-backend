const { BlacklistedToken } = require("../../models");

const getBlacklistedToken = async (refreshToken) => {
    const blacklistedToken = await BlacklistedToken.where({
        "token": refreshToken
    }).fetch({
        require: false
    });
    if (blacklistedToken) {
        return true
    } else {
        return false;
    }
}

module.exports = {
    getBlacklistedToken
}