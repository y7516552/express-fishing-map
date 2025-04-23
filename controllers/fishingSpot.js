const createHttpError = require('http-errors');
const FishingSpotModel = require ('../models/fishingSpot');

const getFishingSpotList = async (_req, res, next) => {
    try {
        const result = await FishingSpotModel.find({
            status: 1
        })

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
        })
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
            locations
        } = req.body;

        const result = await FishingSpotModel.create({
            name,
            description,
            imageUrl,
            imageUrlList,
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
                authorId: req.user?._id,
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


module.exports = {
    getFishingSpotList,
    getFishingSpotById,
    createOneFishingSpot,
    updateFishingSpotById,
    deleteFishingSpotById,
};