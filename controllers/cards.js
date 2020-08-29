const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link, likes } = req.body;

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
  Card.findById(req.params.cardid)
    .orFail()
    .then((card) => {
      if (!(req.user._id === card.owner.toString())) {
        return Promise.reject(new Error('RightsError'));
      }
      return card;
    })
    .then((card) => {
      card.remove();
      return card;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пожалуйста проверьте правильность запроса и корретность введенных данных' });
      } else if (err.message === 'RightsError') {
        res.status(409).send({ message: 'Невозможно удалять карточки других пользователей' });
      } else {
        res.status(404).send({ message: err.message });
      }
    });
};
