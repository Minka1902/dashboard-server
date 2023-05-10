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
        require: false,
    },
    totalMemory: {
        type: Number,
        required: false,
    },
});

module.exports = mongoose.model('sources', sourceSchema);
