const express = require('express');
const router = express.Router();
const FishingTackleShopController = require("../../controllers/fishingTackleShop");


router.get(
    '/',
    FishingTackleShopController.getFishingTackleShopList
);

router.get(
    '/googleMap',
    FishingTackleShopController.getFishingTackleShopFromGoogle
);


router.post(
    '/',
    FishingTackleShopController.createOneFishingTackleShop
);

router.get(
    '/:id',
    FishingTackleShopController.getFishingTackleShopById
);

router.put(
    '/:id',
    FishingTackleShopController.updateFishingTackleShopById
);

router.delete(
    '/:id',
    FishingTackleShopController.deleteFishingTackleShopById
);

module.exports = router;