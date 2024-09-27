const mongoose = require('mongoose');

// Define the Conference schema
const conferenceSchema = new mongoose.Schema({
    conferenceBy:String,
    conferenceByName:String,
    conferenceName: {
        type: String,
        required: true,
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10,15}$/, 'Please enter a valid WhatsApp number']  // Simple regex to validate phone number
    },
    conferenceEmailAddress: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    numberOfReporters: {
        type: Number,
        required: true,
        min: [1, 'Number of reporters must be at least 1'],
    },
    conferenceCost: {
        type: Number,
        default: 0,
        min: [0, 'Cost cannot be negative']
    },
    conferenceDate: {
        type: Date,
        required: true,
    },
    conferenceChannelState: {
        type: String,
        required: true,
    },
    conferenceChannelCity: {
        type: String,
        required: true,
    },
    conferenceArea: {
        type: String,
        required: true,
    },
    conferencePinCode: {
        type: Number,
        required: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pin code']
    },
    conferencePurpose: {
        type: String,
        required: true,
        maxlength: [500, 'Purpose description cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "approved", "cancelled"],
            message: '{VALUE} is not a valid status'
        },
        default: "pending",
    },
}, {
    timestamps: true  // Automatically create `createdAt` and `updatedAt` fields
});

// Create the Conference model
const Conference = mongoose.model('Conference', conferenceSchema);

module.exports = Conference;
