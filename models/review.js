const { Schema, model } = require("mongoose");
const validator = require('validator');
// const fishingSpot = require('./fishingSpot')
const likeSchema = require('./schema/like')


const reviewSchema = new Schema({
    fishingSpotId: {
        type: Schema.Types.ObjectId,
        ref: 'FishingSpots',
        required: [true, 'fishingSpotId 未填寫']
    },
    title: {
        type: String,
        required: [true, 'title 未填寫']
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
        ref: 'Users',
        required: [true, 'authorId 未填寫']
    },
    catchs:{
        type:[{ type : Schema.Types.ObjectId, ref: 'species' }]
    },
    likes:[likeSchema],
    likesCounts:{
        type: Number,
        default: 0
    },
    rating:{
        type: Number,
        default: 0
    },
    
},{
    versionKey: false,
    timestamps: true
})


const ReviewModel = model("reviews", reviewSchema);

module.exports = ReviewModel;