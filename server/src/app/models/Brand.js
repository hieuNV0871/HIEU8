const mongoose = require("mongoose")
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
    position: {
        type: Number,
        default: 0
    }

}, {timestamps: true})


module.exports = mongoose.model("Brand", brandSchema)