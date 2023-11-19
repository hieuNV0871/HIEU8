const mongoose = require("mongoose")
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
    

}, {timestamps: true})


module.exports = mongoose.model("Size", sizeSchema)