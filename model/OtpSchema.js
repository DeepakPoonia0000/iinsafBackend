const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
    },
    expireAt: {
        type: Date,
        default: Date.now, // Set the default value to the current date
        index: { expires: '6m' } // TTL index to expire the document after 6 minutes
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
