const { Router } = require('express');
const Studio = require ('../models/Studio');

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
  });
