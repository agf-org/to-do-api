const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pageSchema = new Schema({
  items: [{type: Schema.Types.ObjectId, ref: 'ItemModel'}],
});

module.exports = mongoose.model('PageModel', pageSchema);
