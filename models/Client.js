const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
  },
  file_number: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('client', ClientSchema);
