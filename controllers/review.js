const createHttpError = require('http-errors');
const ReviewModel = require ('../models/review');

const getReviewList = async (_req, res, next) => {
    try {
        const result = await ReviewModel.find({
            status: 1
        }).populate({
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
                status: -1
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


module.exports = {
    getReviewList,
    getReviewById,
    createOneReview,
    updateReviewById,
    likeReviewById,
    deleteReviewById,
};