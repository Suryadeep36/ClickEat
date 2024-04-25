const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = {
    name: String,
    email: String,
    phone: String,
    totalprice: String,
    finalprice: String,
    quantity: String,
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