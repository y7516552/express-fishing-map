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

module.exports = router;