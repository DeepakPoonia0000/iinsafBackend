const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userName: String,
    postDate

}, { timestamps: true });


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
