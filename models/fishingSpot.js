// import itemSchema, { IItem } from './schema/item';
const { Schema, model } = require("mongoose");
const validator = require('validator');
const likeSchema = require('./schema/like')

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
        likes:[likeSchema],
        likesCounts:{
            type: Number,
            default: 0
        },
        locations: locationSchema, // Array field containing objects with name and coordinates
        city:{
            type: String,
            enum: ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "基隆市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"],
            required : [true, 'city 未填寫']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const FishingSpotModel = model("FishingSpots", fishingSpotSchema);

module.exports = FishingSpotModel;