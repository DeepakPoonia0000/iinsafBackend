const mongoose = require('mongoose');

// Define the user schema with appropriate validations and types
const unverifiedUserSchema = new mongoose.Schema({
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
        // required: [true, 'Join as field is required'],
    },
    gender: {
        type: String,
        // required: [true, 'Gender is required'],
        enum: ['male', 'female'] // Consider using enum for gender
    },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '6m' }
    }
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

// Create the User model from the schema
const UnverifiedUser = mongoose.model('UnverifiedUser', unverifiedUserSchema);

module.exports = UnverifiedUser;
