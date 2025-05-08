const createHttpError = require('http-errors');
const ReportModel = require ('../models/report');

const getReportList = async (_req, res, next) => {
    try {
        const result = await ReportModel.find({
            status: 1
        }).populate({
            path: 'userId',
            select: 'name avatarUrl',
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const getReportById = async (req, res, next) => {
    try {
        const result = await ReportModel.findOne({
            _id: req.params.id,
            status: 1
        }).populate({
            path: 'userId',
            select: 'name avatarUrl',
        });
        if (!result) {
            throw createHttpError(404, '此報告不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const createOneReport = async (req, res, next) => {
    try {
        const {
            type,
            title,
            description,
            imageUrlList,
        } = req.body;

        const result = await ReportModel.create({
            type,
            title,
            description,
            imageUrlList,
            userId: req.user?._id,
        }).populate({
            path: 'userId',
            select: 'name avatarUrl',
        });

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

const updateReportById = async (req, res, next) => {
    try {
        const {
            type,
            title,
            description,
            imageUrlList,
        } = req.body;

        const result = await ReportModel.findByIdAndUpdate(
            req.params.id,
            {
                type,
                title,
                description,
                imageUrlList,
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'userId',
            select: 'name avatarUrl',
        });
        if (!result) {
            throw createHttpError(404, '此報告不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};



const deleteReportById = async (req, res, next) => {
    try {

        const result = await ReportModel.findByIdAndUpdate(
            req.params.id,
            {
                status: 0
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'userId',
            select: 'name avatarUrl',
        });

        if (!result) {
            throw createHttpError(404, '此報告不存在');
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
    getReportList,
    getReportById,
    createOneReport,
    updateReportById,
    deleteReportById,
};