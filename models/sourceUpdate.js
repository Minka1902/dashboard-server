const mongoose = require('mongoose');

const sourceUpdateSchema = new mongoose.Schema({
    ip: {
        type: String,
        unique: true,
        required: true,
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

module.exports = mongoose.model('sourceUpdate', sourceUpdateSchema);
