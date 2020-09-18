var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var notebookSchema = new Schema({
  id: String,
  items: [{ type: Schema.Types.ObjectId, ref: 'PageModel' }],
});

module.exports = mongoose.model('NotebookModel', notebookSchema );
