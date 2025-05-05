const createHttpError = require('http-errors');
const ReviewModel = require ('../models/review');
const FishingSpotModel = require('../models/fishingSpot')

const getReviewList = async (_req, res, next) => {
    try {
        const result = await ReviewModel.find({
            status: 1
        }).populate({
            path: 'fishingSpotId'
        }).populate({
            path: 'authorId',
            select: 'name avatarUrl',
        }).populate({
            path: 'catchs',
            select: 'CommonName imageUrl fishDBUrl',
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const getReviewById = async (req, res, next) => {
    try {
        const result = await ReviewModel.findOne({
            _id: req.params.id,
            status: 1
        }).populate({
            path: 'fishingSpotId'
        });
        if (!result) {
            throw createHttpError(404, '此評論不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const createOneReview = async (req, res, next) => {
    try {
        const {
            fishingSpotId,
            title,
            description,
            imageUrl,
            imageUrlList,
            catchs,
            rating
        } = req.body;

        const fishingSpot = await FishingSpotModel.findOne({
            _id: fishingSpotId,
            status: 1
        })
        
        if (!fishingSpot) {
            throw createHttpError(404, '此釣點不存在');
        }

        const result = await ReviewModel.create({
            fishingSpotId,
            title,
            description,
            imageUrl,
            imageUrlList,
            authorId: req.user?._id,
            catchs,
            rating
        });

        fishingSpot.reviews.push(result._id)

        await FishingSpotModel.findOneAndUpdate(
            {
                _id: fishingSpotId,
            },
            {
                reviews:fishingSpot.reviews
            }
        )


        await result.populate({
            path: 'fishingSpotId'
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const updateReviewById = async (req, res, next) => {
    try {
        const {
            fishingSpotId,
            title,
            description,
            imageUrl,
            imageUrlList,
            authorId,
            catchs,
            rating
        } = req.body;

        const result = await ReviewModel.findByIdAndUpdate(
            req.params.id,
            {
                fishingSpotId,
                title,
                description,
                imageUrl,
                imageUrlList,
                authorId,
                catchs,
                rating
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'fishingSpotId'
        });
        if (!result) {
            throw createHttpError(404, '此評論不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const likeReviewById = async (req, res, next) => {
    try {
        const newLike = {
            userId: req.user?._id,
            date: new Date()
        };

        const review = await ReviewModel.findOneById(req.params.id);

        if (!review) {
            throw createHttpError(404, '此評論不存在');
        }

        const reviewLikes = [...review.likes]
        const likesCounts = review.likesCounts+1
        reviewLikes.push(newLike)

        const result = await review.update({
            likes:reviewLikes,
            likesCounts:likesCounts
        })


        // if (!result) {
        //     throw createHttpError(404, '此評論不存在');
        // }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};


const deleteReviewById = async (req, res, next) => {
    try {

        const result = await ReviewModel.findByIdAndUpdate(
            req.params.id,
            {
                status: 0
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'fishingSpotId'
        });

        if (!result) {
            throw createHttpError(404, '此評論不存在');
        }

        // const fishingSpot = await FishingSpotModel.findOne({
        //     _id: result.fishingSpotId,
        //     status: 1
        // })
        
        // if (!fishingSpot) {
        //     throw createHttpError(404, '此釣點不存在');
        // }

        // fishingSpot.reviews =  fishingSpot.reviews.filter(item => item !== result._id)

        // await FishingSpotModel.findOneAndUpdate(
        //     {
        //         _id: result.fishingSpotId,
        //     },
        //     {
        //         reviews:fishingSpot.reviews
        //     }
        // )

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getReviewList,
    getReviewById,
    createOneReview,
    updateReviewById,
    likeReviewById,
    deleteReviewById,
};