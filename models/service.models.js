const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    vehicle_no: {
        type: String,
        required: true
    },
    pickup_date: {
        type: DateOnly,
        required: true
    },
    drop_date: {
        type: DateOnly,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    service_location: {
        type: String,
        required: true
    },
    service_price: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        defaults: 'Unpaid'
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt: Date
});

module.exports = mongoose.model('Service', serviceSchema);