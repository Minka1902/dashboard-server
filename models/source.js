const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    lastActive: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    lastChecked: {
        type: Date,
        required: true
    },
    memoryLeft: {
        type: Number,
    },
    totalMemory: {
        type: Number,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('sources', sourceSchema);
