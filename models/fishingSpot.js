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


const fishingSpotSchema = new Schema(
    {
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
        status: {
            type: Number,
            default: 1
        },
        type:{
            type: String,
            required: [true, 'type 未填寫']
        },
        fishingAllowed:{
            type:Boolean,
            default: true
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: [true, 'authorId 未填寫']
        },
        reviews:{
            type:[{ type : Schema.Types.ObjectId, ref: 'reviews' }]
        },
        locations: locationSchema // Array field containing objects with name and coordinates
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const FishingSpotModel = model("FishingSpots", fishingSpotSchema);

module.exports = FishingSpotModel;