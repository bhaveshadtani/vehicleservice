const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const carFuelSchema = new Schema({
    fuelType: {
        type: String,
        required: true
    },
    fuelImage: {
        type: String,
        required:true
    },
    modelId: {
        type: Schema.Types.ObjectId,
        ref: 'carModel',
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
module.exports = mongoose.model('carFuel',carFuelSchema);

// cart: {
//     items: [{
//         productId: {
//             type: Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },
//         quantity: {
//             type: Number,
//             required: true
//         },
//         price: {
//             type: Number,
//             required: true
//         }
//     }]
// }