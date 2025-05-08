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
        description: {
            type: String,
            required: [true, 'description 未填寫']
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
        locations: locationSchema // Array field containing objects with name and coordinates
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const fishingTackleShopModel = model("fishingTackleShops", fishingTackleShopSchema);

module.exports = fishingTackleShopModel;