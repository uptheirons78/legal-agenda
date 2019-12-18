const mongoose = require('mongoose');

const FolderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'client',
  },
  folder_number: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'judicial',
  },
});

module.exports = mongoose.model('folder', FolderSchema);
