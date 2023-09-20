const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    ip: {
        type: String,
        unique: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    isMachine: {
        type: Boolean,
        required: true,
        default: false,
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
        required: true,
    },
    totalCapacity: {
        type: Number,
    },
    capacityLeft: {
        type: Number,
    },
    totalMemory: {
        type: Number,
    },
    freeMemory: {
        type: Number,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('sources', sourceSchema);
