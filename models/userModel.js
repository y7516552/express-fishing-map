const { Schema, model } = require("mongoose");
const validator = require('validator');



const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name 未填寫'],
    validate: {
      validator(value) {
        return validator.isLength(value, { min: 2 });
      },
      message: 'name 至少 2 個字元以上'
    }
  },
  email: {
    type: String,
    required: [true, 'email 未填寫'],
    validate: {
        validator(value) {
            return validator.isEmail(value);
        },
        message: 'Email 格式不正確'
    }
  },
  password: {
    type: String,
    required: false,
    // required: [true, 'password 未填寫'],
    select: false
  },
  phone: {
    type: String,
    // required: [true, 'phone 未填寫']
  },
  verificationToken: {
    type: String,
    default: '',
    select: false
  },
  role:{
    type: String,
    default: 'user',
  },
  avatarUrl:{
    type: String,
    default:'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY',
    validate: {
        validator(value) {
            return validator.isURL(value, { protocols: ['https'] });
        },
        message: 'avatarUrl 格式不正確'
    }
  },
  // OAuth 登入方式
    providers: [
      {
        provider: { type: String }, // 'google', 'facebook', 'github'...
        providerId: { type: String }, // 各平台唯一ID
      },
    ],
});

const UserModel = model("Users", UserSchema);

module.exports = UserModel;