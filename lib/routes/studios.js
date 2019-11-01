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
      .select({ address: false, __v: false })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id)
        .select({ __v: false }),
      Film.find({ studio: req.params.id })
        .select({ __v: false, released: false, cast: false, studio: false })
        .populate('film', { title: true, _id: true })
    ])
      .then(([studio, films]) => res.send({ ...studio.toJSON(), films }))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .find({ studio: req.params.id })
      .then(films => {
        if(films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio))
            .catch(next);
        } else {
          res.send({
            message: 'Could not delete because the studio has produced at least one film.'
          });
        }
      })
      .catch(next);
  });

