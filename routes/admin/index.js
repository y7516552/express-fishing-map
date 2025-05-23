const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middlewares');

const fishingSpotRouter = require('./fishingSpot');
const reviewRouter = require('./review');
const speciesRouter = require('./species');
const fishingTackleShopRouter = require('./fishingTackleShop');


router.use(isAdmin);

router.use(
    '/fishingSpots',
    fishingSpotRouter
);

router.use(
    '/reviews',
    reviewRouter
);

router.use(
    '/species',
    speciesRouter
);

router.use(
    '/fishingTackleShop',
    fishingTackleShopRouter
);




module.exports = router;
