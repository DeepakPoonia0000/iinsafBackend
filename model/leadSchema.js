const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadBy: {
        type: String,
    },
    leadByName: {
        type: String,
    },
    channelType: {
        type: String,
        required: true
    },
    adType: {
        type: String,
        required: true
    },
    requiredViews: {
        type: Number,
        min: 100
    },
    adLength: {
        type: Number,
        min: 5
    },
    adCost: {
        type: Number
    },
    adState: {
        type: String,
        required: true
    },
    adCity: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        enum: {
            values: ["self", "iinsaf"],
            message: '{VALUE} is not a valid option for createdBy'
        },
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "approved", "cancelled"],
            message: '{VALUE} is not a valid status'
        },
        default: "pending",
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    adDescription: {
        type: String,
        trim: true
    },
    adNote: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
