const express = require('express');
const router = express.Router();
const FishingSpotController = require("../../controllers/fishingSpot");

router.get(
    '/',
    FishingSpotController.getFishingSpotList
);

router.post(
    '/',
    FishingSpotController.createOneFishingSpot
);

router.get(
    '/:id',
    FishingSpotController.getFishingSpotById
);

router.put(
    '/:id',
    FishingSpotController.updateFishingSpotById
);

router.delete(
    '/:id',
    FishingSpotController.deleteFishingSpotById
);

module.exports = router;