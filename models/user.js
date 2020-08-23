const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: true,
  },

  email:{
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('user', userSchema);
