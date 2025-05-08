const createHttpError = require('http-errors');
const FishingSpotModel = require ('../models/fishingSpot');
const ReviewModel = require ('../models/review');

const getFishingSpotList = async (_req, res, next) => {
    try {
        const result = await FishingSpotModel.find({
            status: 1
        }).populate({
            path: 'authorId',
            select: 'name avatarUrl',
        }).populate({
            path: 'likes',
            select: 'name avatarUrl',
        }).populate({
            path: 'reviews',
            match: { status: { $eq: 1 }},
            populate: [
                { 
                    path: 'authorId',
                    select: 'name avatarUrl', 
                },
                {
                    path: 'catchs',
                    select: 'CommonName imageUrl fishDBUrl',
                }
            ]
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const getFishingSpotById = async (req, res, next) => {
    try {
        const result = await FishingSpotModel.findOne({
            _id: req.params.id,
            status: 1
        }).populate({
            path: 'authorId',
            select: 'name avatarUrl',
        }).populate({
            path: 'likes',
            select: 'name avatarUrl',
        }).populate({
            path: 'reviews',
            match: { status: { $eq: 1 }},
            populate: [
                { 
                    path: 'authorId',
                    select: 'name avatarUrl', 
                },
                {
                    path: 'catchs',
                    select: 'CommonName imageUrl fishDBUrl',
                }
            ]
        });

        if (!result) {
            throw createHttpError(404, '此釣點不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const createOneFishingSpot = async (req, res, next) => {
    try {
        const {
            name,
            description,
            imageUrl,
            imageUrlList,
            type,
            fishingAllowed,
            locations
        } = req.body;

        const result = await FishingSpotModel.create({
            name,
            description,
            imageUrl,
            imageUrlList,
            type,
            fishingAllowed,
            authorId: req.user?._id,
            locations
        });

        // await result.populate({
        //     path: 'fishingSpotId'
        // });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const updateFishingSpotById = async (req, res, next) => {
    try {
        const {
            name,
            description,
            imageUrl,
            imageUrlList,
            type,
            fishingAllowed,
            locations
        } = req.body;

        const result = await FishingSpotModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                name,
                description,
                imageUrl,
                imageUrlList,
                type,
                fishingAllowed,
                locations
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!result) {
            throw createHttpError(404, '此釣點不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const deleteFishingSpotById = async (req, res, next) => {
    try {
        const result = await FishingSpotModel.findByIdAndUpdate(
            req.params.id,
            {
                status: -1
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!result) {
            throw createHttpError(404, '此釣點不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const likeFishingSpotById = async (req, res, next) => {
    try {
        const newLike = {
            userId: req.user?._id,
            date: new Date()
        };

        const fishingSpot = await FishingSpotModel.findOne({
            _id: req.params.id,
            status: 1
        });

        if (!fishingSpot) {
            throw createHttpError(404, '此釣點不存在');
        }

        if(fishingSpot.likes.some(e => e.userId.toString() ==  req.user?._id)) {
            throw createHttpError(404, '此用戶已喜歡');
        }

        const fishingSpotLikes = [...fishingSpot.likes]
        fishingSpotLikes.push(newLike)
        console.log('fishingSpotLikes',fishingSpotLikes)

        const result = await FishingSpotModel.findOneAndUpdate({_id: req.params.id, status: 1},{
            likes:fishingSpotLikes,
            likesCounts:fishingSpot.likesCounts+1
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

const dislikeFishingSpotById = async (req, res, next) => {
    try {
        
        const fishingSpot = await FishingSpotModel.findOne({
            _id: req.params.id,
            status: 1
        });

        if (!fishingSpot) {
            throw createHttpError(404, '此釣點不存在');
        }

        const likeIndex = fishingSpot.likes.findIndex(e => e.userId.toString() ==  req.user?._id)

        if(likeIndex === -1) {
            throw createHttpError(404, '此用戶未喜歡');
        }

        fishingSpot.likes.splice(likeIndex,1)

        const result = await FishingSpotModel.findOneAndUpdate({_id: req.params.id, status: 1},{
            likes:fishingSpot.likes,
            likesCounts:fishingSpot.likesCounts-1
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


module.exports = {
    getFishingSpotList,
    getFishingSpotById,
    createOneFishingSpot,
    updateFishingSpotById,
    deleteFishingSpotById,
    likeFishingSpotById,
    dislikeFishingSpotById
};