const { Schema, model } = require("mongoose");
const validator = require('validator');

const speciesSchema = new Schema({
    CommonName:{
        
    }

})

const SpeciesModel = model("species", speciesSchema);

module.exports = SpeciesModel;