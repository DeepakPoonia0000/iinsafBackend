const mongoose = require('mongoose');

const contactUs = new mongoose.Schema({
    uName: String,
    uNumber: String,
    uEmail: String,
    uSubject: String,
    uMessage: String
});

const ContactUs = mongoose.model('ContactUs', contactUs);

module.exports = ContactUs;
