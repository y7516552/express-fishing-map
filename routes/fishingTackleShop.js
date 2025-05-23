const express = require('express');
const router = express.Router();
const FishingTackleShopController = require("../controllers/fishingTackleShop");


router.get(
    '/',
    FishingTackleShopController.getFishingTackleShopList
);

router.get(
    '/googleMap',
    FishingTackleShopController.getFishingTackleShopFromGoogle
);


router.get(
    '/:id',
    FishingTackleShopController.getFishingTackleShopById
);


module.exports = router;