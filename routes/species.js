const express = require('express');
const router = express.Router();
const SpeciesController = require("../controllers/species");

router.get(
    '/',
    SpeciesController.getSpeciesList
);

router.get(
    '/:id',
    SpeciesController.getSpeciesById
);

module.exports = router;