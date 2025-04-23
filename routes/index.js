const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const speciesRouter = require('./species');
const fishingSpotRouter = require('./fishingSpot')
const admin = require('./admin/index')

/* GET home page. */
router.get('/healthCheck', function(req, res, next) {
  const healthCheck = {
    status: true,
    message: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    host: req.headers.host
  };
  res.send(healthCheck);
});

router.use(
  '/api/v1/user',
  usersRouter
);
router.use(
  '/api/v1/species',
  speciesRouter
);

router.use(
  '/api/v1/fishingSpot',
  fishingSpotRouter
);

router.use(
  '/api/v1/admin',
  admin
);

module.exports = router;
