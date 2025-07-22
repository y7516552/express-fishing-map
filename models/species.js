const { Schema, model } = require("mongoose");
const validator = require('validator');

const speciesSchema = new Schema({
    CommonName:{
        type: String,
        required: [true, 'CommonName 未填寫']
    },
    ScientificName:{
        type: String,
        required: [true, 'ScientificName 未填寫']
    },
    imageUrl: {
        type: String,
        required: [true, 'imageUrl 未填寫'],
        validate: {
            validator(value) {
                return validator.isURL(value, { protocols: ['https'] });
            },
            message: 'imageUrl 格式不正確'
        }
    },
    tags: [
        {
            type: String,
            trim: true,
        }
    ],
    fishDBUrl: {
        type: String,
        required: [true, 'fishDBUrl 未填寫'],
        validate: {
            validator(value) {
                return validator.isURL(value, { protocols: ['https'] });
            },
            message: 'fishDBUrl 格式不正確'
        }
    },
    status: {
        type: Number,
        default: 1
    },

})

const SpeciesModel = model("species", speciesSchema);

module.exports = SpeciesModel;