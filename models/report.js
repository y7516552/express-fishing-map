const { Schema, model } = require("mongoose");
const validator = require('validator');

const reportSchema = new Schema({
    type:{
        type: String,
        required: [true, 'type 未填寫']
    },
    title: {
        type: String,
        required: [true, 'title 未填寫']
    },
    description: {
        type: String,
        required: [true, 'description 未填寫']
    },
    imageUrlList: [
        {
            type: String,
            trim: true,
            validate: {
                validator(value) {
                    return validator.isURL(value, { protocols: ['https'] });
                },
                message: 'imageUrlList 格式不正確'
            }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'userId 未填寫']
    },
    status: {
        type: Number,
        default: 1
    },

})

const reportModel = model("report", reportSchema);

module.exports = reportModel;