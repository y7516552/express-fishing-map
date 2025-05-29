// import itemSchema, { IItem } from './schema/item';
const { Schema, model } = require("mongoose");
const validator = require('validator');

const locationSchema = new Schema({
    type: { 
      type: String, 
      default: 'Point' ,
      required: true
    }, // Set the type to 'Point' by default
    coordinates: { type: [Number], index: "2dsphere", required: true } // Array containing longitude and latitude values
  });


const fishingTackleShopSchema = new Schema(
    {
        placesId:{
            type: String,
            required: [true, 'placesId 未填寫']
        },
        name: {
            type: String,
            required: [true, 'name 未填寫']
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
            required: [true, 'detail 未填寫']
        },
        googleMapsUri:{
            type: String,
            required: [true, 'googleMapsUri 未填寫'],
            validate: {
                validator(value) {
                    return validator.isURL(value, { protocols: ['https'] });
                },
                message: 'googleMapsUri 格式不正確'
            }
        },
        status: {
            type: Number,
            default: 1
        },
        city:{
            type: String,
            enum: ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "基隆市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"],
            required : [true, 'city 未填寫']
        },
        locations: locationSchema // Array field containing objects with name and coordinates
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const fishingTackleShopModel = model("fishingTackleShops", fishingTackleShopSchema);

module.exports = fishingTackleShopModel;