const mongoose = require('mongoose');

// Define the user schema with appropriate validations and types
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
    },
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    userPassword: {
        type: String,
        required: [true, 'User password is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    userState: {
        type: String,
        required: [true, 'User state is required'],
    },
    userCity: {
        type: String,
        required: [true, 'User city is required'],
    },
    joinAs: {
        type: String,
        enum: ["reporter", "advertiser", "influencer"],  // Enum values
        required: true,  // Make the field mandatory
        message: 'The value `{VALUE}` is not a valid option for joinAs'  // Custom error message
    },
    gender: {
        type: String,
        // required: [true, 'Gender is required'],
        enum: ['male', 'female'] // Consider using enum for gender
    },
    userWebsite: String,
    userArea: String,
    userPincode: String,
    userSecondaryPhone: String,
    whatsappNumber: String,
    status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
    isVerified: { type: Boolean, default: false }, // Correctly defined

}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
