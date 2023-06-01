const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;
const mechanicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: DateOnly,
        required: true
    },
    phone_no: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    userProfileImage: {
        type: String
    },
    createdAt: {
        type: Date
    }
})
module.exports = mongoose.model('Mechanic', mechanicSchema);