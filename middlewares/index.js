const createHttpError = require('http-errors');
const validator = require('validator');
// const RoomModel = require('./models/room');
const UsersModel = require('../models/userModel');
const { verifyToken } = require('../utils/index');

// token 驗證
const isAuth = async (req, _res, next) => {
    /**
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.responses[403] = {
            description: '重新登入',
            schema: {
                "status": false,
                "message": "請重新登入",
            }
        }
     */
    try {
        const token = `${req.headers.authorization?.replace('Bearer ', '')}`;
        const result = verifyToken(token);

        const user = await UsersModel.findById(result.userId);
        if (!user) {
            throw createHttpError(404, '此使用者不存在');
        }

        req.user ??= user;

        next();
    } catch (error) {
        next(error);
    }
};

// TODO:實作管理員權限
const isAdmin = async (req, _res, next) => {
    /**
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.responses[403] = {
            description: '重新登入',
            schema: {
                "status": false,
                "message": "請重新登入",
            }
        }
     */
        try {
            const token = `${req.headers.authorization?.replace('Bearer ', '')}`;
            const result = verifyToken(token);
    
            const user = await UsersModel.findById(result.userId);
            if (!user) {
                throw createHttpError(404, '此使用者不存在');
            }
            
            if(user.role!=='admin'){
                throw createHttpError(403, '此使用者沒有權限');
            }
            req.user ??= user;
    
            next();
        } catch (error) {
            next(error);
        }
};

const checkRequestBodyValidator = (req, _res, next) => {
    try {
        for (let [key, value] of Object.entries(req.body)) {
            if (value === undefined || value === null) {
                throw new Error('欄位未填寫正確');
            }

            const _value = `${value}`;

            switch (key) {
                case 'name':
                    if (!validator.isLength(_value, { min: 2 })) {
                        throw new Error('name 至少 2 個字元以上');
                    }
                    break;
                case 'email':
                    if (!validator.isEmail(_value)) {
                        throw new Error('Email 格式不正確');
                    }
                    break;
                case 'password':
                case 'newPassword':
                    if (!validator.isLength(_value, { min: 8 })) {
                        throw new Error('密碼需至少 8 碼以上');
                    }
                    if (validator.isAlpha(_value)) {
                        throw new Error('密碼不能只有英文');
                    }
                    if (validator.isNumeric(_value)) {
                        throw new Error('密碼不能只有數字');
                    }
                    if (!validator.isAlphanumeric(_value)) {
                        throw new Error('密碼需至少 8 碼以上，並英數混合');
                    }
                    break;
                case 'image':
                    if (!validator.isURL(_value, { protocols: ['https'] })) {
                        throw new Error('image 格式不正確');
                    }
                    break;
                default:
                    break;
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

// const checkOrder = async (req, _res, next) => {
//     try {
//         const { roomId, checkInDate, checkOutDate, peopleNum } = req.body;

//         const roomInfo = await RoomModel.findOne({
//             _id: roomId,
//             status: 1
//         });

//         if (!roomInfo) {
//             throw createHttpError(404, '此房型不存在');
//         }

//         if (peopleNum > roomInfo.maxPeople) {
//             throw new Error('peopleNum 錯誤');
//         }

//         if (!validator.isDate(checkInDate)) {
//             throw new Error('checkInDate 格式錯誤');
//         }

//         if (!validator.isDate(checkOutDate)) {
//             throw new Error('checkOutDate 格式錯誤');
//         }

//         if (new Date(checkInDate) > new Date(checkOutDate)) {
//             throw new Error('checkInDate 錯誤');
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// };


module.exports = {
    isAuth,
    isAdmin,
    checkRequestBodyValidator,
}