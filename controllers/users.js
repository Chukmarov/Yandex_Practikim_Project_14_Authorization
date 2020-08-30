const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  new Promise((resolve, reject) => {
    if (req.body.password === undefined || req.body.password === '') {
      const err = new Error('Вы пропустили поле password');
      err.name = 'MissingPoleError';
      reject(err);
    }
    resolve(bcrypt.hash(req.body.password, 10));
  })
    .then((password) => {
      return User.create({
        name, about, avatar, email, password,
      });
    })
    .then(() => User.findOne({ email }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(409).send({ message: err.message });
      } else if (err.name === 'MissingPoleError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userid)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Данный пользователь отсутсвует в базе' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Проверьте пожалуйста корректность введенных данных' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
