const createHttpError = require( 'http-errors');
const jsonWebToken = require( 'jsonwebtoken');

const generateToken = (payload) => {
    return jsonWebToken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY
    });
};
const verifyToken = (token) => {
    try {
        return jsonWebToken.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        throw createHttpError(403, '請重新登入');
    }
};
const generateEmailToken = () => {
    const code = generateRandomCode();
    const token = jsonWebToken.sign({ code }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
    return { code, token };
};
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
};

module.exports = {
    generateToken,
    verifyToken,
    generateEmailToken,
}