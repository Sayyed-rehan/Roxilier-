const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    sold:Boolean,
    dateOfSale:Date
});

const Transaction  = mongoose.model("Transaction", postSchema);

module.exports = Transaction;