const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        expires: '5m',
        default: Date.now
    }

});

module.exports = mongoose.model('otp', otpSchema);