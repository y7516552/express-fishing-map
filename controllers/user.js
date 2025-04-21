const bcrypt = require('bcryptjs');
const createHttpError = require('http-errors');
const UsersModel = require ('../models/userModel');
const { generateToken, verifyToken } = require( '../utils/index');

const signup = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const checkEmail = await UsersModel.findOne({ email });
        if (checkEmail) {
            throw createHttpError(400, '此 Email 已註冊');
        }

        const _result = await UsersModel.create({
            name,
            email,
            phone,
            password: await bcrypt.hash(password, 6)
        });
        const { password: _, ...result } = _result.toObject();

        res.send({
            status: true,
            token: generateToken({ userId: result._id }),
            result
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UsersModel.findOne({ email }).select('+password');
        if (!user) {
            throw createHttpError(404, '此使用者不存在');
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw createHttpError(400, '密碼錯誤');
        }

        const { password: _, ...result } = user.toObject();

        res.send({
            status: true,
            token: generateToken({ userId: user._id }),
            result
        });
    } catch (error) {
        next(error);
    }
};

const forget = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await UsersModel.findOne({ email }).select('+verificationToken');
        if (!user) {
            throw createHttpError(404, '此使用者不存在');
        }

        const payload = verifyToken(user.verificationToken);

        if (payload.code === code) {
            await UsersModel.findByIdAndUpdate(
                user._id,
                {
                    password: await bcrypt.hash(newPassword, 6)
                },
                {
                    new: true
                }
            );
        }

        res.send({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

const check = async (req, res) => {
    const token = `${req.headers.authorization?.replace('Bearer ', '')}`;
    res.send({
        status: true,
        token
    });
};

const getInfo = async (req, res) => {
    res.send({
        status: true,
        result: req.user
    });
};

const updateInfo = async (req, res, next) => {
    try {
        // 更新密碼
        await updateUserPassword(req);

        const { userId, name, phone } = req.body;

        if (!userId) {
            throw createHttpError(400, 'userId 未填寫');
        }

        const result = await UsersModel.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const updateUserPassword = async (req) => {
    const { userId, oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return null;
    }

    const user = await UsersModel.findById(userId).select('+password');
    if (!user) {
        throw createHttpError(404, '此使用者不存在');
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
        throw createHttpError(400, '密碼錯誤');
    }

    const result = await UsersModel.findByIdAndUpdate(
        userId,
        {
            password: await bcrypt.hash(newPassword, 6)
        },
        {
            new: true
        }
    );

    return result;
};

module.exports = {
    signup,
    login,
    forget,
    check,
    getInfo,
    updateInfo,
  };