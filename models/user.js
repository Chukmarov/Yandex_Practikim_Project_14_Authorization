const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

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

  email: {
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.plugin(uniqueValidator, { message: 'Данный пользователь уже присутвует в базе, пожалуйста авторизируйтесь' });

module.exports = mongoose.model('user', userSchema);
