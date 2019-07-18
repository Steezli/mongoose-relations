const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id),
      Film.find({ studio: req.params.id })
    ])
      .then(([studio, films]) => res.send({ ...studio.toJSON(), films }))
      .catch(next);
  });

