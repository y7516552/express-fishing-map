const express = require('express');
const router = express.Router();
const FishingSpotController = require("../controllers/fishingSpot");

const { isAuth } = require('../middlewares/index')

router.get(
    '/',
    FishingSpotController.getFishingSpotList
);

router.post(
    '/',
    isAuth,
    FishingSpotController.createOneFishingSpot
);

router.get(
    '/:id',
    FishingSpotController.getFishingSpotById
);

router.put(
    '/:id',
    isAuth,
    FishingSpotController.updateFishingSpotById
);

router.delete(
    '/:id',
    isAuth,
    FishingSpotController.deleteFishingSpotById
);

router.get(
    '/:id/like',
    isAuth,
    FishingSpotController.likeFishingSpotById
);


router.get(
    '/:id/dislike',
    isAuth,
    FishingSpotController.dislikeFishingSpotById
);

module.exports = router;