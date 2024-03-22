const mongoose = require('mongoose');

const customerSchema = {
    username: String,
    email: String,
    phone: String,
    password: String,
}

const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;