const express = require('express');
const router = express.Router();
const ReportController = require("../../controllers/report");

router.get(
    '/',
    ReportController.getAllReportList
);

router.post(
    '/',
    ReportController.createOneReport
);

router.get(
    '/:id',
    ReportController.getReportById
);

router.put(
    '/:id',
    ReportController.updateReportById
);

router.delete(
    '/:id',
    ReportController.deleteReportById
);




module.exports = router;