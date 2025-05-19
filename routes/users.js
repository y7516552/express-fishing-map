const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user");
const { checkRequestBodyValidator, isAuth } = require('../middlewares')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use(checkRequestBodyValidator);

router.post(
  '/login',
  UserController.login
);

router.post(
  '/signup',
  UserController.signup
);

router.post(
  '/forgot',
  UserController.forget
);

router.get(
  '/check',
  isAuth,
  UserController.check
);

router.get(
  '/me',
  isAuth,
  UserController.getInfo
);

router.put(
  '/me',
  isAuth,
  UserController.updateInfo
);

module.exports = router;
