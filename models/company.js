const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    location: {
        type: String,
        unique: true,
    }
});

module.exports = mongoose.model('companies', companySchema);
