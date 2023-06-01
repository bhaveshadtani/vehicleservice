

const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    vehicle_no: {
        type: String,
        required: true
    },
    car_brand: {
        type: String,
        required: true
    },
    car_model: {
        type: String,
        required: true
    },
    car_fuel: {
        type: String,
        required: true
    },
    service_date: {
        type: DateOnly,
        required: true
    },
    service_location: {
        type: String,
        required: true
    },
    service_details: {
        type: String,
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