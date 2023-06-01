const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productStockSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt: Date
});

module.exports = mongoose.model('productStock', productStockSchema);