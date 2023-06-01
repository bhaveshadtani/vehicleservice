const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;

const serviceDetailSchema = new Schema({
    service_name: {
        type: String,
        required: true,
    },
    service_image: {
        type: String,
        required: true
    },
    service_description: {
        type: String,
        required: true,
    },
    service_price: {
        type: Number,
        default: 1000,
        required: true,
    },
    service_list: [{
        type: String,
        required: true,
    }],
    service_time: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt:{
        type:Date,
        defaults: Date.now()
    } 
});

module.exports = mongoose.model('ServiceDetail', serviceDetailSchema);