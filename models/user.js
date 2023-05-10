const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: 'Email is not valid.',
    },
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
    select: false,
  },
  username: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  savedArticles: [{
    required: false,
  }],
});

module.exports = mongoose.model('users', userSchema);
