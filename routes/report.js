const express = require('express');
const router = express.Router();
const ReportController = require("../controllers/report");
const { isAuth } = require('../middlewares/index')

router.get(
    '/',
    isAuth,
    ReportController.getUserReportList
);

router.post(
    '/',
    isAuth,
    ReportController.createOneReport
);

router.get(
    '/:id',
    isAuth,
    ReportController.getReportById
);

router.put(
    '/:id',
    isAuth,
    ReportController.updateReportById
);

router.delete(
    '/:id',
    isAuth,
    ReportController.deleteReportById
);




module.exports = router;