const express = require('express');
const router = express.Router();
const SpeciesController = require("../../controllers/species");

router.get(
    '/',
    SpeciesController.getSpeciesList
);

router.post(
    '/',
    SpeciesController.createOneSpecies
);

router.get(
    '/:id',
    SpeciesController.getSpeciesById
);

router.put(
    '/:id',
    SpeciesController.updateSpeciesById
);

router.delete(
    '/:id',
    SpeciesController.deleteSpeciesById
);

module.exports = router;