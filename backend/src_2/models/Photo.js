const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const schema = new Schema({
    title: String,
    description: String,
    imagePath: String
});

const Photo = model('Photo', schema);
module.exports = Photo;

