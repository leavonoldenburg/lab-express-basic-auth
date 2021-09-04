const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

userSchema.plugin(uniqueValidator, {
  message: 'This Username has already been used. Please choose another one.'
});

module.exports = User;
