const createHttpError = require('http-errors');
const SpeciesModel = require ('../models/species');

const getSpeciesList = async (_req, res, next) => {
    try {
        const result = await SpeciesModel.find({
            status: 1
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const getSpeciesById = async (req, res, next) => {
    try {
        const result = await SpeciesModel.findOne({
            _id: req.params.id,
            status: 1
        });
        if (!result) {
            throw createHttpError(404, '此魚種不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const createOneSpecies = async (req, res, next) => {
    try {
        const {
            CommonName,
            ScientificName,
            imageUrl,
            fishDBUrl,
            tags
        } = req.body;

        const result = await SpeciesModel.create({
            CommonName,
            ScientificName,
            imageUrl,
            fishDBUrl,
            tags
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const updateSpeciesById = async (req, res, next) => {
    try {
        const {
            CommonName,
            ScientificName,
            imageUrl,
            fishDBUrl,
            tags
        } = req.body;

        const result = await SpeciesModel.findByIdAndUpdate(
            req.params.id,
            {
                CommonName,
                ScientificName,
                imageUrl,
                fishDBUrl,
                tags
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) {
            throw createHttpError(404, '此魚種不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const deleteSpeciesById = async (req, res, next) => {
    try {
        const result = await SpeciesModel.findByIdAndUpdate(
            req.params.id,
            {
                status: -1
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) {
            throw createHttpError(404, '此魚種不存在');
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
    getSpeciesList,
    getSpeciesById,
    createOneSpecies,
    updateSpeciesById,
    deleteSpeciesById,
};