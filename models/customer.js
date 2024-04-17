const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const customerSchema = {
    username: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    choosenItems: [
        {
            name: String,
            id: String,
            quantity: Number,
            price: String
        }
    ]
}
const Customer = new Schema(customerSchema)
Customer.plugin(passportLocalMongoose,{
    usernameField: "email" 
});

module.exports = mongoose.model('Customer', Customer);