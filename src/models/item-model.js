var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
  id: String,
  text: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('ItemModel', itemSchema );
