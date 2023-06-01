const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const carBrandSchema = new Schema({
    brandName: {
        type: String,
        required: true
    },
    brandImage: {
        type: String,
        required:true
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt: {
        type: Date
    }
})
module.exports = mongoose.model('car_Brand',carBrandSchema);