const { Schema } = require("mongoose");

const likeSchema = new Schema(
    {
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        date: {
            type: Date,
            required: [true, 'Date 未填寫']
        },
    },
    {
        _id: false
    }
);

// const SpeciesModel = model("species", speciesSchema);

module.exports = likeSchema;
