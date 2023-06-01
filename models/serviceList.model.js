const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceListSchema = new Schema({
    serviceName: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt: Date
});

module.exports = mongoose.model('ServiceList', serviceListSchema);