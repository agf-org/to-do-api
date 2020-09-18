var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pageSchema = new Schema({
  id: String,
  items: [{ type: Schema.Types.ObjectId, ref: 'ItemModel' }],
});

module.exports = mongoose.model('PageModel', pageSchema );
