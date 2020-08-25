const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
 if(req.user === req.owner){
  Card.findById(req.params.cardid)
  .orFail(new Error('Данная карточка отсутсвует в базе'))
  .then((cardid) => {
    cardid.remove();
    return res.send({ data: cardid });
  })
  .catch((err) => res.status(404).send({ message: err.message }));
 } else{
  res.status(500).send({ message: 'Невозможно удалять карточки других пользователей' })
 }

};
