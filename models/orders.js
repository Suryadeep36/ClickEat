const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = {
    name: String,
    price: String,
    id: String,
    choosenItems: [
        {
            name: String,
            id: String,
            quantity: Number,
            price: String
        }
    ]
}

const order = Schema(orderSchema);

module.exports = mongoose.model('Order', order);