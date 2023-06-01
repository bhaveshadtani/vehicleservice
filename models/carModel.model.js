const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const carModelSchema = new Schema({
    modelName: {
        type: String,
        required: true
    },
    modelImage: {
        type: String,
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'carBrand',
        required: true
    },
    isDeleted: {
        type: Boolean,
        defaults: false
    },
    createdAt: {
        type: Date
    }
})
module.exports = mongoose.model('carModel', carModelSchema);

