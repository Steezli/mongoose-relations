const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
// const Actor = require ('../models/Actor');
// const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      company
    } = req.body;

    Reviewer
      .create({ name, company })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  });
