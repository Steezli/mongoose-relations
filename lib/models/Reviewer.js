const mongoose = require('mongoose');

const reviewerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Reviewer', reviewerSchema);
