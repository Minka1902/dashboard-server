const mongoose = require('mongoose');

const sourceUpdateSchema = new mongoose.Schema({
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
