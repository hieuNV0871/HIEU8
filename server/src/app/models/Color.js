const mongoose = require("mongoose")
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
}, {timestamps: true})


module.exports = mongoose.model("Color", colorSchema)