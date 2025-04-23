const express = require('express');
const router = express.Router();
const ReviewController = require("../controllers/review");

router.get(
    '/',
    ReviewController.getReviewList
);

router.get(
    '/:id',
    ReviewController.getReviewById
);
//likeReviewById,

router.get(
    '/:id/like',
    ReviewController.likeReviewById
);

module.exports = router;