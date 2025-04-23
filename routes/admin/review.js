const express = require('express');
const router = express.Router();
const ReviewController = require("../../controllers/review");

router.get(
    '/',
    ReviewController.getReviewList
);

router.post(
    '/',
    ReviewController.createOneReview
);

router.get(
    '/:id',
    ReviewController.getReviewById
);

router.put(
    '/:id',
    ReviewController.updateReviewById
);

router.delete(
    '/:id',
    ReviewController.deleteReviewById
);

module.exports = router;