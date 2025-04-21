// import itemSchema, { IItem } from './schema/item';
const { Schema, model } = require("mongoose");
const validator = require('validator');

const locationSchema = new mongoose.Schema({
    name: String,
    coordinates: {
      type: { type: String, default: 'Point' }, // Set the type to 'Point' by default
      coordinates: { type: [Number], required: true } // Array containing longitude and latitude values
    }
  });


const fishingSpotSchema = new Schema<IRoom>(
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
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'authorId 未填寫']
        },
        reviews:{
            type:[{ type : Schema.Types.ObjectId, ref: 'Reviews' }]
        },
        locations: [locationSchema] // Array field containing objects with name and coordinates
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const FishingSpotModel = model("FishingSpots", fishingSpotSchema);

module.exports = FishingSpotModel;