const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({email})
  .then((user) => {
    if(!user){
      return Promise.reject(new Error('Неправильные почта или пароль'))
    }
    return bcrypt.compare(password, user.password);
  })
  .then((matched) =>{
    if(!matched){
      return Promise.reject(new Error('Неправильные почта или пароль'))
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true
     });
  })
  .end()
  .catch((err) => {
    res.status(401).send({message:err.message});
  })
};