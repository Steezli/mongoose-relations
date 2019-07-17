const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Actor', actorSchema);
